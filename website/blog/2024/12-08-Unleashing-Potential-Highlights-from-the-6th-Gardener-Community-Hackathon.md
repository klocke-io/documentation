---
title: "Unleashing Potential: Highlights from the 6th Gardener Community Hackathon"
linkTitle: "Unleashing Potential: Highlights from the 6th Gardener Community Hackathon"
newsSubtitle: December 08, 2024
publishdate: 2024-12-08

date: 2024-12-08
authors:
- name: Rafael Franzke
  email: rafael.franzke@sap.com
  avatar: https://avatars.githubusercontent.com/u/19169361
aliases: ["/blog/2024/12/08/01"]
---

# Unleashing Potential: Highlights from the 6th Gardener Community Hackathon

![Hackathon 2024/12 Team](images/hackathon202412-team.jpg "Hackathon 2024/12 Team")

The [6th Gardener Community Hackathon](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md), hosted at [Schlosshof Freizeitheim](https://www.schlosshof-info.de/) in [Schelklingen, Germany](https://maps.app.goo.gl/28FZXpzZLjgaKNef9) in December 2024, was a hub of creativity and collaboration. Developers of various companies joined forces to explore new frontiers of the Gardener project. Here's a rundown of the key outcomes:

1. [🌐 **IPv6 Support on IronCore**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#-ipv6-support-on-ironcore) The team successfully created dual-stack shoot clusters on IronCore, although LoadBalancer services for IPv6 traffic still need some work.
2. [🔁 **Version Classification Lifecycle in `CloudProfile`**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#-version-classification-lifecycle-in-cloudprofiles) A Gardener Enhancement Proposal (GEP) was developed to predefine the timestamps for Kubernetes or machine image version classifications in `CloudProfile`s.
3. [💡 **Gardener SLIs: Shoot Cluster Creation/Deletion Times**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#-gardener-slis-shoot-cluster-creationdeletion-times) Metrics for shoot cluster creation and deletion times were exposed, improving observability in end-to-end testing.
4. [🛡️ **Enhanced `Seed` Authorizer With Label/Field Selectors**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#%EF%B8%8F-enhanced-seed-authorizer-with-labelfield-selectors) The `Seed` Authorizer was upgraded to enforce label/field selectors, restricting `gardenlet` access to specific `Shoot` resources.
5. [🔑 **Bring Your Own ETCD Encryption Key via Key Management Systems**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#-bring-your-own-etcd-encryption-key-via-key-management-systems) Users can now manage the encryption key for ETCD of shoot clusters using external key management systems like Vault or AWS KMS.
6. [⚖️ **Load Balancing for Calls to `kube-apiserver`**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#%EF%B8%8F-load-balancing-for-calls-to-kube-apiservers) Scalability and load balancing of requests to `kube-apiserver` were improved by leveraging Istio.
7. [🪴 **Validate PoC For In-Place Node Updates Of Shoot Clusters**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#-validate-poc-for-in-place-node-updates-of-shoot-clusters) A proof-of-concept for in-place updates of Kubernetes minor versions and machine image versions in shoot clusters was validated.
8. [🚀 **Prevent `Pod` Scheduling Issues Due To Overscaling**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#-prevent-pod-scheduling-issues-due-to-overscaling) The issue of the Vertical Pod Autoscaler recommending resource requirements beyond the allocatable resources of the largest nodes was addressed.
9. [💪🏻 **Prevent Multiple `systemd` Unit Restarts On Reconciliation Errors**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#-prevent-multiple-systemd-unit-restarts-on-reconciliation-errors) The reconciliation process of `gardener-node-agent` was improved to prevent multiple restarts of `systemd` units.
10. [🤹‍♂️ **Trigger Nodes Rollout Individually per Worker Pool During Credentials Rotation**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#%EF%B8%8F-trigger-nodes-rollout-individually-per-worker-pool-during-credentials-rotation) More control over the rollout of worker nodes during shoot cluster credentials rotation was introduced.
11. [⛓️‍💥 **E2E Test Skeleton For Autonomous Shoot Clusters**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#%EF%B8%8F-e2e-test-skeleton-for-autonomous-shoot-clusters) The e2e test infrastructure for managing autonomous shoot clusters was established.
12. [⬆️ **Deploy Prow Via Flux**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#%EF%B8%8F-deploy-prow-via-flux) Prow, Gardener's CI and automation system, was deployed using Flux, a cloud-native solution for continuous delivery based on GitOps.
13. [🚏 **Replace `TopologyAwareHints` With `ServiceTrafficDistribution`**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#-replace-topologyawarehints-with-servicetrafficdistribution) `TopologyAwareHints` were replaced with `ServiceTrafficDistribution`, eliminating custom code in Gardener.
14. [🪪 **Support More Use-Cases For `TokenRequestor`**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#-support-more-use-cases-for-tokenrequestor) The injection of the current CA bundle into access secrets was enabled, supporting more use cases.
15. [🫄 **`cluster-autoscaler`'s `ProvisioningRequest` API**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#-cluster-autoscalers-provisioningrequest-api) The `ProvisioningRequest` API in `cluster-autoscaler` was introduced, allowing users to provision new nodes or check if a pod would fit in the existing cluster without scaling up.
16. [👀 **Watch `ManagedResource`s In `Shoot` Care Controller**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#-watch-managedresources-in-shoot-care-controller) A watch for `ManagedResource`s in the `Shoot` care controller was introduced, re-evaluating health checks immediately when relevant conditions change.
17. [🐢 **Cluster API Provider For Gardener**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#-cluster-api-provider-for-gardener) The cluster API in Gardener was supported, allowing for the deployment and deletion of shoot clusters via the cluster API.
18. [👨🏼‍💻 **Make `cluster-autoscaler` Work In Local Setup**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#-make-cluster-autoscaler-work-in-local-setup) The `cluster-autoscaler` was made to work in the local setup, setting the `nodeTemplate` in the `MachineClass` for the `cluster-autoscaler` to get the resource capacity of the nodes.
19. [🧹 **Use Structured Authorization In Local KinD Cluster**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#-use-structured-authorization-in-local-kind-cluster) Structured Authorization was used to enable the `Seed` Authorizer in the local KinD clusters, speeding up cluster creation.
20. [🧹 **Drop Internal Versions From Component Configuration APIs**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#-drop-internal-versions-from-component-configuration-apis) The internal version of component configurations was removed, reducing maintenance effort during development.
15:55
21. [🐛 **Fix Non-Functional Shoot Node Logging In Local Setup**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#-fix-non-functional-shoot-node-logging-in-local-setup) The shoot node logging in the local development setup was fixed.
22. [🧹 **No Longer Generate Empty `Secret` For `reconcile` `OperatingSystemConfig`s**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#-no-longer-generate-empty-secret-for-reconcile-operatingsystemconfigs) The generation of an empty `Secret` for `reconcile` `OperatingSystemConfig`s was stopped.
23. [🖥️ **Generic Monitoring Extension**:](https://github.com/gardener-community/hackathon/blob/main/2024-12_Schelklingen/README.md#%EF%B8%8F-generic-monitoring-extension) The requirements for externalizing the monitoring aspect of Gardener were discussed.

These outcomes reflect the ongoing progress and collaborative spirit of the Gardener community. We're eager to see what the next Hackathon will bring. Keep an eye out for more updates on the Gardener project!
