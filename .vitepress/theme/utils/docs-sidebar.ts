import { generateSidebar } from 'vitepress-sidebar';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {writeJsonDebug} from "./debug-json.js";
import { load } from 'js-yaml';

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

interface SidebarSection {
  base?: string;
  items: SidebarItem[];
}

type Sidebar = Record<string, SidebarSection | SidebarItem[]>;

const docsSidbarConfig =  {
  documentRootPath: '/content',
  scanStartPath: 'docs',
  resolvePath: '/docs/',
  collapsed: true,
  useTitleFromFileHeading: true,
  useTitleFromFrontmatter: true,
  capitalizeFirst: true,
}

function generateDocsSidebar(): any {
    return generateSidebar([docsSidbarConfig]);
}

/**
 * Wrapper function that generates and enhances the docs sidebar
 * @returns The enhanced sidebar with updated directory titles
 */
export function generateEnhancedDocsSidebar(): any {
  // Generate the base sidebar
  const sidebar = generateDocsSidebar();
  
  // Recursively enhance directory titles from frontmatter
  const enhancedSidebar = enhanceDirectoryTitles(sidebar);

  // Sort entries by weight from frontmatter
  const sortedSidebar = sortByWeight(enhancedSidebar);

  // Filter out all _index.md entries (called last)
  const filteredSidebar = removeIndexEntries(sortedSidebar);

  writeJsonDebug(
    'enhancedSidebar.json',
    filteredSidebar
  );

  return filteredSidebar;
}

/**
 * Recursively removes all _index.md entries from the sidebar
 */
function removeIndexEntries(sidebar: any): any {
  if (Array.isArray(sidebar)) {
    return sidebar
      .map(item => removeIndexEntries(item))
      .filter(item => item !== null);
  }
  
  if (typeof sidebar !== 'object' || sidebar === null) {
    return sidebar;
  }
  
  // Create a copy of the object
  const filtered = { ...sidebar };
  
  // If this object has items, filter them
  if (filtered.items && Array.isArray(filtered.items)) {
    filtered.items = filtered.items
      .map((item: any) => {
        // Filter out items that are _index entries
        if (item.link && (item.link === '_index' || item.link.endsWith('/_index'))) {
          return null;
        }
        // Recursively process remaining items
        return removeIndexEntries(item);
      })
      .filter((item: any) => item !== null);
  }
  
  // Process other properties recursively
  for (const [key, value] of Object.entries(filtered)) {
    if (key !== 'items' && typeof value === 'object') {
      filtered[key] = removeIndexEntries(value);
    }
  }
  
  return filtered;
}

/**
 * Recursively sorts sidebar entries by weight from frontmatter
 */
function sortByWeight(sidebar: any): any {
  if (Array.isArray(sidebar)) {
    // Sort the array by weight and recursively process items
    return sidebar
      .map(item => sortByWeight(item))
      .sort((a, b) => {
        const weightA = getWeightForItem(a);
        const weightB = getWeightForItem(b);
        return weightA - weightB;
      });
  }
  
  if (typeof sidebar !== 'object' || sidebar === null) {
    return sidebar;
  }
  
  // Create a copy of the object
  const sorted = { ...sidebar };
  
  // If this object has items, sort them
  if (sorted.items && Array.isArray(sorted.items)) {
    sorted.items = sorted.items
      .map((item: any) => sortByWeight(item))
      .sort((a: any, b: any) => {
        const weightA = getWeightForItem(a);
        const weightB = getWeightForItem(b);
        return weightA - weightB;
      });
  }
  
  // Process other properties recursively
  for (const [key, value] of Object.entries(sorted)) {
    if (key !== 'items' && typeof value === 'object') {
      sorted[key] = sortByWeight(value);
    }
  }
  
  return sorted;
}

/**
 * Gets the weight for a sidebar item from its frontmatter
 */
function getWeightForItem(item: any): number {
  if (!item || typeof item !== 'object') {
    return Number.MAX_SAFE_INTEGER; // Put invalid items at the end
  }
  
  // If it's a directory with items, check for _index file
  if (item.items && Array.isArray(item.items)) {
    const indexItem = item.items.find((subItem: any) => 
      subItem.link && (subItem.link === '_index' || subItem.link.endsWith('/_index'))
    );
    
    if (indexItem) {
      const weight = getWeightFromFile(indexItem.link, item.base);
      if (weight !== null) {
        return weight;
      }
    }
  }
  
  // If it's a leaf item with a link, get weight from that file
  if (item.link && typeof item.link === 'string') {
    const weight = getWeightFromFile(item.link, item.base);
    if (weight !== null) {
      return weight;
    }
  }
  
  // Default weight if no weight found
  return Number.MAX_SAFE_INTEGER;
}

/**
 * Reads the weight from a file's frontmatter
 */
function getWeightFromFile(link: string, base?: string): number | null {
  try {
    // Construct the file path
    let filePath: string;
    
    if (link === '_index') {
      // For root _index files
      filePath = join(process.cwd(), 'content', base ? base.replace(/^\/|\/$/g, '') : '', '_index.md');
    } else if (link.endsWith('/_index')) {
      // For nested _index files
      const relativePath = link.replace('/_index', '');
      filePath = join(process.cwd(), 'content', 'docs', relativePath, '_index.md');
    } else {
      // For regular files
      filePath = join(process.cwd(), 'content', 'docs', `${link}.md`);
    }
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return null;
    }
    
    // Read the file content
    const content = readFileSync(filePath, 'utf-8');
    
    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      return null;
    }
    
    // Parse YAML frontmatter
    const frontmatter = load(frontmatterMatch[1]) as any;
    
    // Return the weight if it exists and is a number
    const weight = frontmatter?.weight;
    return typeof weight === 'number' ? weight : null;
    
  } catch (error) {
    console.warn(`Error reading weight from ${link}:`, error);
    return null;
  }
}

/**
 * Recursively enhances directory titles by reading from _index.md frontmatter
 */
function enhanceDirectoryTitles(sidebar: any): any {
  if (Array.isArray(sidebar)) {
    return sidebar.map(item => enhanceDirectoryTitles(item));
  }
  
  if (typeof sidebar !== 'object' || sidebar === null) {
    return sidebar;
  }
  
  // Create a copy of the object
  const enhanced = { ...sidebar };
  
  // If this object has items (indicating it's a directory), enhance it
  if (enhanced.items && Array.isArray(enhanced.items)) {
    // Look for _index.md file in the items
    const indexItem = enhanced.items.find((item: any) => 
      item.link && (item.link === '_index' || item.link.endsWith('/_index'))
    );
    
    if (indexItem) {
      // Try to read the frontmatter and update the title
      const title = getTitleFromIndexFile(indexItem.link, enhanced.base);
      if (title) {
        enhanced.text = title;
      }
    }
    
    // Recursively process all items
    enhanced.items = enhanced.items.map((item: any) => enhanceDirectoryTitles(item));
  }
  
  // If it's a top-level section with items, process those too
  if (enhanced.base && enhanced.items) {
    enhanced.items = enhanced.items.map((item: any) => enhanceDirectoryTitles(item));
  }
  
  // Process other properties recursively
  for (const [key, value] of Object.entries(enhanced)) {
    if (key !== 'items' && typeof value === 'object') {
      enhanced[key] = enhanceDirectoryTitles(value);
    }
  }
  
  return enhanced;
}

/**
 * Reads the title from an _index.md file's frontmatter
 */
function getTitleFromIndexFile(link: string, base?: string): string | null {
  try {
    // Construct the file path
    let filePath: string;
    
    if (link === '_index') {
      // For root _index files
      filePath = join(process.cwd(), 'content', base ? base.replace(/^\/|\/$/g, '') : '', '_index.md');
    } else if (link.endsWith('/_index')) {
      // For nested _index files
      const relativePath = link.replace('/_index', '');
      filePath = join(process.cwd(), 'content', 'docs', relativePath, '_index.md');
    } else {
      return null;
    }
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return null;
    }
    
    // Read the file content
    const content = readFileSync(filePath, 'utf-8');
    
    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      return null;
    }
    
    // Parse YAML frontmatter
    const frontmatter = load(frontmatterMatch[1]) as any;
    
    // Return the title if it exists
    return frontmatter?.title || null;
    
  } catch (error) {
    console.warn(`Error reading title from ${link}:`, error);
    return null;
  }
}

export function personaSidebar(persona: 'Users' | 'Developers' | 'Operators') {
  // Use the enhanced sidebar instead of the basic one
  const generatedSidebar = generateEnhancedDocsSidebar();
  
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
      if (!allowedLeafMap.has(item.link)) {
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
