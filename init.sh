#!/bin/bash

PROJECT=maap
APP=maap
ROLE=get-role
NS=maap
CLUSTER=https://kubernetes.default.svc
SRC=https://github.com/argoproj/argocd-example-apps.git



kubectl apply -f gitops/project.yml
kubectl apply -f gitops/maap.yml

#argocd app get maap
argocd app sync maap
#argocd login 127.0.0.1 --username=admin --password=111111 --insecure
#argocd proj create ${PROJECT} -d ${CLUSTER},${NS} -s ${SRC}


