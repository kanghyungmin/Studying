=================== killer.sh 1회

---
FQDN : section100.section.lima-workload.svc.cluster.local
# kubectl -n lima-workload edit pod section100
apiVersion: v1
kind: Pod
metadata:
  name: section100
  namespace: lima-workload
  labels:
    name: section
spec:
  hostname: section100  # set hostname
  nodeName: cka5248     # nodeName
  subdomain: section    # set subdomain to same name as service
  containers:
    - image: httpd:2-alpine
      name: pod
...

// restart Deployment
kubectl -n lima-control rollout restart deploy controller

// expose
k expose pod my-static-pod-cka2560 --name static-pod-service --type=NodePort --port 80

//worker node certificates
1. location : /var/lib/kubelet/pki
2. openssl x509 -noout -text -in $file_location


// LivenessProbe and readinessProbe
    resources: {}
    livenessProbe:                                      # add from here
      exec:
        command:
        - 'true'
    readinessProbe:
      exec:
        command:
        - sh
        - -c
        - 'wget -T2 -O- http://service-am-i-ready:80'   # to here
  
  // k -n $namespace exec -it $pod-id -- sh
  k -n lima-control exec -it controller-586d6657-gdmch -- sh

// container search 
crictl ps

//daemon set
 kubectl -n kube-system get ds

//deployment
kubectl -n kube-system get deploy

//Secret file 생성
 k -n secret create secret generic secret2 --from-literal=user=user1 --from-literal=pass=1234

# cka2560:/home/candidate/11.yaml
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: secret-pod
  name: secret-pod
  namespace: secret                       # important if not automatically added
spec:
  containers:
  - args:
    - sh
    - -c
    - sleep 1d
    image: busybox:1
    name: secret-pod
    resources: {}
    env:                                  # add
    - name: APP_USER                      # add
      valueFrom:                          # add
        secretKeyRef:                     # add
          name: secret2                   # add
          key: user                       # add
    // another example 
    - name: MY_NODE_NAME                                                          # add
      valueFrom:                                                                  # add
        fieldRef:                                                                 # add
          fieldPath: spec.nodeName     
    - name: APP_PASS                      # add
      valueFrom:                          # add
        secretKeyRef:                     # add
          name: secret2                   # add
          key: pass                       # add
    volumeMounts:                         # add
    - name: secret1                       # add
      mountPath: /tmp/secret1             # add
      readOnly: true                      # add
  dnsPolicy: ClusterFirst
  restartPolicy: Always
  volumes:                                # add
  - name: secret1                         # add
    secret:                               # add
      secretName: secret1                 # add
status: {}

k get node cka5248 --show-labels

=================== killer.sh 2회





