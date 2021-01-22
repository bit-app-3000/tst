#!/bin/bash

d=dist/cert

mkdir -p ${d}

# Create config
root_cnf=${d}/root.cnf
server_cnf=${d}/server.cnf
v3=${d}/server.v3.ext

# Create paths
CApem=${d}/RootCA.pem
CAkey=${d}/RootCA.key
CAcrt=${d}/RootCA.crt

csr=${d}/dev.csr
key=${d}/dev.key
crt=${d}/dev.crt


# Create certificate config

cat <<EOM > ${root_cnf}
[req]
default_bits=2048
prompt=no
default_md=sha256
distinguished_name=dn

[dn]
C=US
ST=State
L=City
O=Organization
OU=Unit
emailAddress=cert@domain.com
CN=RootCA
EOM

cat <<EOM > ${server_cnf}
[req]
default_bits=2048
prompt=no
default_md=sha256
distinguished_name=dn

[dn]
C=IN
ST=State
L=City
O=Organization
OU=Unit
emailAddress=cert@domain.com
CN=precise64
EOM

cat <<EOM > ${v3}
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
EOM


# Create certificate authority RootCA
openssl req -x509 -new -nodes -keyout ${CAkey} -out ${CApem} -config ${root_cnf}
openssl x509 -outform pem -in ${CApem} -out ${CAcrt}

# Create local name certificate
openssl req -new -nodes -newkey rsa:2048 -keyout ${key} -out ${csr} -config ${server_cnf}
openssl x509 -req -sha256 -days 1024 -in ${csr} -CA ${CApem} -CAkey ${CAkey} -CAcreateserial -extfile ${v3} -out ${crt}


echo 'Done'
