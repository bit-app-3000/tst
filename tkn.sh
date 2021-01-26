#ssh-keygen -t rsa -b 4096 -C "tekton@tekton.dev"
# save as tekton / tekton.pub
# add tekton.pub contents to GitHub

# create secret YAML from contents

#cat > tekton-git-ssh-secret.yml << EOM
#apiVersion: v1
#kind: Secret
#metadata:
#  name: git-ssh-key
#  namespace: tekton-pipelines
#  annotations:
#    tekton.dev/git-0: github.comtek+
#type: kubernetes.io/ssh-auth
#data:
#  ssh-privatekey: $(cat ./z/tekton | base64 -w 0)
#---
#EOM
#
#
#kubectl create secret -n tekton-pipelines generic argocd-env-secret '--from-literal=ARGOCD_AUTH_TOKEN=<token>'
#
#
#kubectl apply -f tekton-git-ssh-secret.yml
#kubectl apply -n tekton-pipelines -f regsecret.yaml
