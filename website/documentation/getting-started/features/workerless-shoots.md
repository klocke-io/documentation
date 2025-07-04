---
title: Workerless Shoots
weight: 2
description: Understand how to create workerless shoots in Gardener for control plane-only Kubernetes clusters without worker nodes for orchestration use cases.
tags: [workerless shoots, control plane, kubernetes api, orchestration, etcd, kube-apiserver, no nodes]
page_synonyms: [control plane only, nodeless clusters, api only clusters, workerless clusters, control plane service]
categories: [cluster types, orchestration, control plane]
---

## Controlplane as a Service

![workerless-shoots](./images/workerless-shoots.png)

Sometimes, there may be use cases for Kubernetes clusters that don't require pods but only features of the control plane. Gardener can create the so-called "workerless" shoots, which are exactly that. A Kubernetes cluster without nodes (and without any controller related to them).

In a scenario where you already have multiple clusters, you can use it for orchestration (leases) or factor out components that require many CRDs.

As part of the control plane, the following components are deployed in the seed cluster for workerless shoot:

- etcds
- kube-apiserver
- kube-controller-manager
- gardener-resource-manager
- Logging and monitoring components
- Extension components (to find out if they support workerless shoots, see the [Extensions](https://github.com/gardener/gardener/blob/master/docs/extensions/resources/extension.md#what-is-required-to-register-and-support-an-extension-type) documentation)
