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
crictl ps containerId
crictl inspect containerId

//daemon set
 kubectl -n kube-system get ds

//deployment
kubectl -n kube-system get deploy

//Secret file 생성
 k -n secret create secret generic secret2 --from-literal=user=user1 --from-literal=pass=1234

# cka2560:/home/candidate/11.yaml
k exec -n secret secret-pod -- sh "sleep 1d"
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
    // another example2 
    - name: "name"
      value: "alpha"  
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
kubectl scale deploymnet my-nginx --replicas=2



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
spec:****
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



https://velog.io/@dm911/kubernetes-CKA-study-34-Mock-Exam-1-Mock-Exam-2
https://velog.io/@dm911/kubernetes-CKA-study-last-Mock-Exam-3-lightning-lab
https://velog.io/@dm911/kubernetes-CKA-study-36-CKA-%EC%8B%9C%ED%97%98%EC%A0%91%EC%88%98-%EB%B0%8F-killer.sh-%ED%92%80%EC%9D%B4
[gosmdochi.tistory.com/7](https://gosmdochi.tistory.com/8)
https://gosmdochi.tistory.com/9?category=1028041
https://wlsdn3004.tistory.com/45


k expose pod podName --type=Nordport --port=80 --name mess
kubectl expose deployment/my-nginx

kubectl create deployment nginx-deploy --image=nginx:1.16 --dry-run=client -o yaml > deploy.yaml
kubectl apply -f deploy.yaml --record
kubectl rollout history deployment nginx-deploy
kubectl set image deployment/nginx-deploy nginx=nginx:1.17 --record
kubectl rollout history deployment nginx-deploy
kubectl rollout undo deployment/nginx-deploy --to-revision=1
// restart Deployment
kubectl -n lima-control rollout restart deploy controller



apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: john-developer
spec:
  request: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQ1ZqQ0NBVDRDQVFBd0VURVBNQTBHQTFVRUF3d0dZVzVuWld4aE1JSUJJakFOQmdrcWhraUc5dzBCQVFFRgpBQU9DQVE4QU1JSUJDZ0tDQVFFQTByczhJTHRHdTYxakx2dHhWTTJSVlRWMDNHWlJTWWw0dWluVWo4RElaWjBOCnR2MUZtRVFSd3VoaUZsOFEzcWl0Qm0wMUFSMkNJVXBGd2ZzSjZ4MXF3ckJzVkhZbGlBNVhwRVpZM3ExcGswSDQKM3Z3aGJlK1o2MVNrVHF5SVBYUUwrTWM5T1Nsbm0xb0R2N0NtSkZNMUlMRVI3QTVGZnZKOEdFRjJ6dHBoaUlFMwpub1dtdHNZb3JuT2wzc2lHQ2ZGZzR4Zmd4eW8ybmlneFNVekl1bXNnVm9PM2ttT0x1RVF6cXpkakJ3TFJXbWlECklmMXBMWnoyalVnald4UkhCM1gyWnVVV1d1T09PZnpXM01LaE8ybHEvZi9DdS8wYk83c0x0MCt3U2ZMSU91TFcKcW90blZtRmxMMytqTy82WDNDKzBERHk5aUtwbXJjVDBnWGZLemE1dHJRSURBUUFCb0FBd0RRWUpLb1pJaHZjTgpBUUVMQlFBRGdnRUJBR05WdmVIOGR4ZzNvK21VeVRkbmFjVmQ1N24zSkExdnZEU1JWREkyQTZ1eXN3ZFp1L1BVCkkwZXpZWFV0RVNnSk1IRmQycVVNMjNuNVJsSXJ3R0xuUXFISUh5VStWWHhsdnZsRnpNOVpEWllSTmU3QlJvYXgKQVlEdUI5STZXT3FYbkFvczFqRmxNUG5NbFpqdU5kSGxpT1BjTU1oNndLaTZzZFhpVStHYTJ2RUVLY01jSVUyRgpvU2djUWdMYTk0aEpacGk3ZnNMdm1OQUxoT045UHdNMGM1dVJVejV4T0dGMUtCbWRSeEgvbUNOS2JKYjFRQm1HCkkwYitEUEdaTktXTU0xMzhIQXdoV0tkNjVoVHdYOWl4V3ZHMkh4TG1WQzg0L1BHT0tWQW9FNkpsYWFHdTlQVmkKdjlOSjVaZlZrcXdCd0hKbzZXdk9xVlA3SVFjZmg3d0drWm89Ci0tLS0tRU5EIENFUlRJRklDQVRFIFJFUVVFU1QtLS0tLQo=
  signerName: kubernetes.io/kube-apiserver-client
  usages:
  - client auth

cat john.csr | base64 | tr -d "\n"

k certificate approve john-developer
kubectl create role developer --verb=create,update,delete,get,list,watch --resource=pods -n development
kubectl create rolebinding john-developer --role=developer --user=john -n development

kubectl create serviceaccount pvviewer
kubectl create clusterrole pvviewer-role --verb=list --resource=persistentvolumes
kubectl create clusterrole pvviewer-role-binding --clusterrole=pvviewer-role --serviceaccount=default:pvviewer

apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: pvviewer
  name: pvviewer
spec:
  serviceAccountName: pvviewer
  containers:
  - image: redis
    name: pvviewer
    resources: {}
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}

//taint 정의
kubectl taint nodes node01 env_type=production:NoSchedule
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: prod-redis
  name: prod-redis
spec:
  containers:
  - image: redis:alpine
    name: prod-redis
    resources: {}
  tolerations:
  - key: "env_type"
    operator: "Equal"
    value: "production"
    effect: "NoSchedule"
  dnsPolicy: ClusterFirst
  restartPolicy: Always
status: {}


k get nodes --kubeconfig /root/CKA/super.kubeconfig #해당 컨피그 파일을 이용해서 클러스트 접속
cat .kube/config


systemctl status docker => systemctl enable --now docker
systemctl status kubelet => systemctl enable --now kubelet
systemctl restart kubelet

ETCDCTL_API=3 etcdctl snapshot restore /tmp/etcd-backup.db \
--data-dir=/var/lib/etcd-restored

mv /var/lib/etcd /var/lib/etcd-backup
mv /var/lib/etcd-restored /var/lib/etcd

systemctl start etcd
systemctl start kube-apiserver