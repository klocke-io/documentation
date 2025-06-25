import { generateSidebar } from 'vitepress-sidebar';
import { readFileSync } from 'node:fs';
import {writeJsonDebug} from "./debug-json.js";

export const docsSidbarConfig =  {
  documentRootPath: '/content',
  scanStartPath: 'docs',
  resolvePath: '/docs/',
  collapsed: true,
  capitalizeFirst: true,
  //useTitleFromFrontmatter: true,
}

export const blogSidebarConfig = {
    documentRootPath: '/content',
    scanStartPath: 'blog',
    resolvePath: '/blog/',
    collapsed: false,
    capitalizeFirst: true,
   // useTitleFromFrontmatter: true,
    sortFolderTo: "top"
  }
 export const communitySidebarConfig = {
    documentRootPath: '/content',
    scanStartPath: 'community',
    resolvePath: '/community/',
    collapsed: false,
    capitalizeFirst: true,
    useTitleFromFrontmatter: true,
    useFolderTitleFromIndexFile: true,
  }


function generateDocsSidebar() {
    return generateSidebar([docsSidbarConfig],
  );
}

export function personaSidebar(persona: 'Users' | 'Developers' | 'Operators') {

const generatedSidebar = generateDocsSidebar()
    // Get all items from all sections of the sidebar
const allItems: SidebarItem[] = Object.values(generatedSidebar)
  .flatMap(section => extractItems(section));

// Create the leaf map
const leafMap = createLeafMap(allItems);

// Write both the generated sidebar and the leaf map to files
  writeJsonDebug(
  'generatedSidebar.json',
  generatedSidebar
);

  writeJsonDebug(
  `${persona}leafMap.json`,
  Object.fromEntries(leafMap)
);


// Apply filtering for persona and write to file
const personaLeafMap = filterLeafMapByPersona(leafMap, persona);
  writeJsonDebug(
  `/${persona}LeafMap.json`,
  Object.fromEntries(personaLeafMap)
);

// Create sidebar by filtering the generated sidebar
const { filtered: sidebar, deleted: deletedItems } = filterSidebarByLeafMap(
  generatedSidebar,
  personaLeafMap
);

// Write the filtered sidebar and debug info to files
  writeJsonDebug(
  `/${persona}Sidebar.json`,
  sidebar
);

  writeJsonDebug(
  'deletedItems.json',
  deletedItems
);


return sidebar
}



// Type definition for sidebar items based on the example structure
interface SidebarLeaf {
  text: string;
  link: string;
  collapsed?: boolean;
}

interface SidebarBranch {
  text: string;
  items: (SidebarLeaf | SidebarBranch)[];
  collapsed?: boolean;
}

type SidebarItem = SidebarLeaf | SidebarBranch;

// Function to create a map of all leaf nodes
function createLeafMap(items: SidebarItem[]): Map<string, SidebarLeaf> {
  const leafMap = new Map<string, SidebarLeaf>();
  
  function processItem(item: SidebarItem) {
    // If the item has a link and no items, it's a leaf node
    if ('link' in item && !('items' in item)) {
      leafMap.set(item.link, item);
    }
    // If it has items, process them recursively
    if ('items' in item) {
      item.items.forEach(processItem);
    }
  }
  
  items.forEach(processItem);
  return leafMap;
}


// Function to recursively extract all items from a section
function extractItems(section: any): SidebarItem[] {
  if (Array.isArray(section)) {
    return section as SidebarItem[];
  }
  if (section && typeof section === 'object' && 'items' in section) {
    return section.items as SidebarItem[];
  }
  return [];
}



// Function to filter leaf map based on persona permissions
function filterLeafMapByPersona(leafMap: Map<string, SidebarLeaf>, persona: string): Map<string, SidebarLeaf> {
  // Create a copy of the original map
  const filteredMap = new Map(leafMap);
  
  // Read the persona mapping
  const personaMapping = JSON.parse(
    readFileSync(`${import.meta.dirname}/personaMapping.json`, 'utf-8')
  ) as Record<string, string[]>;

  // Process each entry in the persona mapping
  for (const [path, allowedPersonas] of Object.entries(personaMapping)) {
    // Skip entries that already allow this persona
    if (allowedPersonas.includes(persona)) {
      continue;
    }

    // Remove /docs/ prefix from the path
    const strippedPath = path.replace('/docs/', '');

    // Find and remove all matching entries from filteredMap
    for (const [leafKey] of filteredMap) {
      if (leafKey.includes(strippedPath)) {
        filteredMap.delete(leafKey);
      }
    }
  }

  return filteredMap;
}



// Function to filter sidebar based on allowed leaf nodes
function filterSidebarByLeafMap(
  sidebar: Record<string, any>,
  allowedLeafMap: Map<string, SidebarLeaf>
): { filtered: Record<string, any>, deleted: SidebarLeaf[] } {
  const deletedItems: SidebarLeaf[] = [];
  
  function filterItem(item: SidebarItem): SidebarItem | null {
    // If it's a leaf node (has link but no items)
    if ('link' in item && !('items' in item)) {
      // If this leaf is not in the allowed map, add to deleted items
      if (!allowedLeafMap.has(item.link) || item.link.includes('_index')) {
        deletedItems.push(item as SidebarLeaf);
        return null;
      }

      //Prefix the link with /docs/
      item.link = `/docs/${item.link}`;
      return item;
    }
    
    // If it's a branch node (has items)
    if ('items' in item && Array.isArray(item.items)) {
      const branch = item as SidebarBranch;
      const filteredItems = branch.items
        .map((subItem: SidebarItem) => filterItem(subItem))
        .filter((subItem): subItem is SidebarItem => subItem !== null);
      
      // If all items were filtered out, remove this branch too
      if (filteredItems.length === 0) {
        return null;
      }
      
      return {
        ...branch,
        items: filteredItems
      };
    }
    
    return item;
  }

  // Create a deep copy of the sidebar
  const filteredSidebar = JSON.parse(JSON.stringify(sidebar));
  
  // Filter each section of the sidebar
  for (const [path, section] of Object.entries(filteredSidebar)) {
    if (Array.isArray(section)) {
      // If the section is an array, filter its items
      filteredSidebar[path] = section
        .map(item => filterItem(item))
        .filter((item): item is SidebarItem => item !== null);
    } else if (section && typeof section === 'object' && 'items' in section) {
      // If the section has items, filter them
      const sectionWithItems = section as { items: SidebarItem[] };
      const filteredItems = sectionWithItems.items
        .map((item: SidebarItem) => filterItem(item))
        .filter((item): item is SidebarItem => item !== null);

      if (filteredItems.length === 0) {
        // If all items were filtered out, remove the section
        delete filteredSidebar[path];
      } else {
        // Update the section with filtered items
        filteredSidebar[path] = {
          ...section,
          items: filteredItems
        };
      }
    }
  }
  
  return { filtered: filteredSidebar, deleted: deletedItems };
}
