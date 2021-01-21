#!/bin/bash

PROJECT=maap
APP=maap
ROLE=get-role
NS=maap
CLUSTER=https://kubernetes.default.svc
SRC=https://github.com/argoproj/argocd-example-apps.git



#kubectl apply -f gitops/project.yml
#kubectl apply -f gitops/maap.yml

#argocd app get maap
#argocd app sync maap
#argocd login 127.0.0.1 --username=admin --password=111111 --insecure
#argocd proj create ${PROJECT} -d ${CLUSTER},${NS} -s ${SRC}


cd gitops

#step certificate create root.linkerd.cluster.local sample-trust.crt sample-trust.key \
#  --profile root-ca \
#  --no-password \
#  --not-after 43800h \
#  --insecure
#
#
#step certificate inspect sample-trust.crt

#kubectl -n linkerd create secret tls linkerd-trust-anchor \
#  --cert sample-trust.crt \
#  --key sample-trust.key \
#  --dry-run=client -oyaml | \
#kubeseal --controller-name=sealed-secrets -oyaml - | \
#kubectl patch -f - \
#  -p '{"spec": {"template": {"type":"kubernetes.io/tls", "metadata": {"labels": {"linkerd.io/control-plane-component":"identity", "linkerd.io/control-plane-ns":"linkerd"}, "annotations": {"linkerd.io/created-by":"linkerd/cli stable-2.8.1", "linkerd.io/identity-issuer-expiry":"2021-07-19T20:51:01Z"}}}}}' \
#  --dry-run=client \
#  --type=merge \
#  --local -oyaml > resources/linkerd/trust-anchor.yaml

#trust_anchor=`kubectl -n linkerd get secret linkerd-trust-anchor -ojsonpath="{.data['tls\.crt']}" | base64 -d -w 0 -`


#kubectl -n linkerd get secret linkerd-trust-anchor -ojsonpath="{.data['tls\.crt']}" | base64 -d -w 0 -



#diff -b \
#  <(echo "${trust_anchor}" | step certificate inspect -) \
#  <(step certificate inspect sample-trust.crt)
#
#echo "${trust_anchor}"

#argocd app sync maap
#
#argocd app get linkerd -ojson | \
#  jq -r '.spec.source.helm.parameters[] | select(.name == "global.identityTrustAnchorsPEM") | .value'
#
#argocd app sync linkerd

#step certificate create root.linkerd.cluster.local sample-trust.crt sample-trust.key \
#  --profile root-ca \
#  --no-password \
#  --not-after 43800h \
#  --insecure
#
#
#kubectl -n linkerd create secret tls linkerd-trust-anchor \
#  --cert sample-trust.crt \
#  --key sample-trust.key \
#  --dry-run=client -oyaml | \
#kubeseal --controller-name=sealed-secrets -oyaml - | \
#kubectl patch -f - \
#  -p '{"spec": {"template": {"type":"kubernetes.io/tls", "metadata": {"labels": {"linkerd.io/control-plane-component":"identity", "linkerd.io/control-plane-ns":"linkerd"}, "annotations": {"linkerd.io/created-by":"linkerd/cli stable-2.9.2", "linkerd.io/identity-issuer-expiry":"2021-07-19T20:51:01Z"}}}}}' \
#  --dry-run=client \
#  --type=merge \
#  --local -oyaml > resources/linkerd/trust-anchor.yaml

#
#trust_anchor=`kubectl -n linkerd get secret linkerd-trust-anchor -ojsonpath="{.data['tls\.crt']}" | base64 -d -w 0 -`
#
#diff -b \
#  <(echo "${trust_anchor}" | step certificate inspect -) \
#  <(step certificate inspect sample-trust.crt)
#
##argocd app sync maap
#argocd app get linkerd -ojson | \
#  jq -r '.spec.source.helm.parameters[] | select(.name == "global.identityTrustAnchorsPEM") | .value'
#
#echo "${trust_anchor}"
#
#
#linkerd upgrade --identity-trust-anchors-file=gitops/sample-trust.crt



#kubectl -n linkerd get cm linkerd-config -o=jsonpath='{.data.global}' |  \
#jq -r .identityContext.trustAnchorsPem > original-trust.crt
#
#
#kubectl -n linkerd get cm linkerd-config -o=jsonpath='{.data.values}' | \
#jq -r - global.identityTrustAnchorsPEM > original-issuer.crt
#
#
#
#step certificate create root.linkerd.cluster.local trust.crt trust.key \
#  --profile root-ca \
#  --no-password \
#  --not-after 43800h \
#  --insecure


#kubectl -n linkerd create secret tls linkerd-trust-anchor \
#  --cert trust.crt \
#  --key trust.key \
#  --dry-run=client -oyaml

#argocd app get linkerd -ojson | \
#  jq -r '.spec.source.helm.parameters[] | select(.name == "global.identityTrustAnchorsPEM") | .value'
#

#kubectl -n linkerd create secret tls linkerd-trust-anchor \
#  --cert sample-trust.crt \
#  --key sample-trust.key \
#  --dry-run=client -oyaml | \
#kubeseal --controller-name=sealed-secrets -oyaml -

#kubectl get secret linkerd-trust-anchor -n linkerd  -o yaml



#step certificate create root.linkerd.cluster.local ca.crt ca.key \
#--profile root-ca --no-password --insecure

#step certificate create identity.linkerd.cluster.local issuer.crt issuer.key \
#--profile intermediate-ca --not-after 8760h --no-password --insecure \
#--ca ca.crt --ca-key ca.key

#kubectl get secret linkerd-trust-anchor -n linkerd

#kubectl -n linkerd get secret linkerd-trust-anchor -ojsonpath="{.data['tls\.crt']}" | base64 -d -w 0 -
#
#kubectl get secret linkerd-identity-issuer -o yaml -n linkerd

#step certificate inspect ca.crt
trust_anchor=`kubectl -n linkerd get secret linkerd-trust-anchor -ojsonpath="{.data['tls\.crt']}" | base64 -d -w 0 -`
diff -b \
  <(echo "${trust_anchor}" | step certificate inspect -) \
  <(step certificate inspect ca.crt)


  argocd app get linkerd -ojson | \
  jq -r '.spec.source.helm.parameters[] | select(.name == "global.identityTrustAnchorsPEM") | .value'

#step certificate create root.linkerd.cluster.local ca.crt ca.key \
#  --profile root-ca --no-password --insecure &&
#  kubectl create secret tls \
#    linkerd-trust-anchor \
#    --cert=ca.crt \
#    --key=ca.key \
#    --namespace=linkerd

#git diff gitops/resources/linkerd/trust-anchor.yaml
#
#kubectl -n linkerd create secret tls linkerd-trust-anchor \
#  --cert ca.crt \
#  --key ca.key \
#  --dry-run=client -oyaml | \
#kubeseal --controller-name=sealed-secrets -oyaml - | \
#kubectl patch -f - \
#  -p '{"spec": {"template": {"type":"kubernetes.io/tls", "metadata": {"labels": {"linkerd.io/control-plane-component":"identity", "linkerd.io/control-plane-ns":"linkerd"}, "annotations": {"linkerd.io/created-by":"linkerd/cli stable-2.8.1", "linkerd.io/identity-issuer-expiry":"2021-07-19T20:51:01Z"}}}}}' \
#  --dry-run=client \
#  --type=merge \
#  --local -oyaml > resources/linkerd/trust-anchor.yaml
