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

k --kubeconfig /opt/course/1/kubeconfig config get-contexts
k --kubeconfig /opt/course/1/kubeconfig config current-context
k --kubeconfig /opt/course/1/kubeconfig config view -o yaml --raw | base64 -d

// stateful-set을 scale up하는 내용. 
k -n project-h800 scale sts o3db --replicas 1



//pv,pvc, volume mounts
create pv
# cka7968:/home/candidate/6_pv.yaml
kind: PersistentVolume
apiVersion: v1
metadata:
 name: safari-pv
spec:
 capacity:
  storage: 2Gi
 accessModes:
  - ReadWriteOnce
 hostPath:
  path: "/Volumes/Data"

create pvc
# cka7968:/home/candidate/6_pvc.yaml
kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: safari-pvc
  namespace: project-t230
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
     storage: 2Gi
create deployment sets
# cka7968:/home/candidate/6_dep.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  creationTimestamp: null
  labels:
    app: safari
  name: safari
  namespace: project-t230
spec:
  replicas: 1
  selector:
    matchLabels:
      app: safari
  strategy: {}
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: safari
    spec:
      volumes:                                      # add
      - name: data                                  # add
        persistentVolumeClaim:                      # add
          claimName: safari-pvc                     # add
      containers:
      - image: httpd:2-alpine
        name: container
        volumeMounts:                               # add
        - name: data                                # add
          mountPath: /tmp/safari-data               # add

kubectl top node
kubectl top pod --containers=true

curl -k https://kubernetes.default/api/v1/secrets


TOKEN=$(cat /var/run/secrets/kubernetes.io/serviceaccount/token)
curl -k https://kubernetes.default/api/v1/secrets -H "Authorization: Bearer ${TOKEN}"


role // service account // role binding
1. k -n project-hamster create sa processor
2. k -n project-hamster create role processor --verb=create --resource=secret --resource=configmap
3. k -n project-hamster create rolebinding processor --role processor --serviceaccount project-hamster:processor

affinity:                                             
  podAntiAffinity:                                    
    requiredDuringSchedulingIgnoredDuringExecution:   
    - labelSelector:                                  
        matchExpressions:                             
        - key: id                                     
          operator: In                                
          values:                                     
          - very-important                            
      topologyKey: kubernetes.io/hostname 

해석 : Kubernetes에서 Pod 간의 배치 전략(Affinity/Anti-Affinity) 을 정의하는 PodSpec의 일부입니다. 이 설정을 사용하면 특정 라벨이 있는 Pod들이 같은 노드에서 함께 배치되지 않도록 제어할 수 있습니다.


// NetworkPolicy 
 k -n project-snake get pod -L app  #특정 label key를 가진 pod들만 검색

apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: np-backend
  namespace: project-snake
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Egress                    # policy is only about Egress
  egress:
    -                           # first rule
      to:                           # first condition "to"
      - podSelector:
          matchLabels:
            app: db1
      ports:                        # second condition "port"
      - protocol: TCP
        port: 1111
    -                           # second rule
      to:                           # first condition "to"
      - podSelector:
          matchLabels:
            app: db2
      ports:                        # second condition "port"
      - protocol: TCP
        port: 2222

k -n project-tiger run tigers-reunite --image=httpd:2-alpine --labels "pod=container,container=pod"



//to cng service subnet cidr, we check kube-apiserver and kube-controller-manager.yaml
