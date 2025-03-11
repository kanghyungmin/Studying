-- multi-container
apiVersion: v1
kind: Pod
metadata:
  name: multi-container-playground
  namespace: default
spec:
  volumes:
    - name: shared-volume
      emptyDir: {}  # Pod가 삭제되면 데이터도 삭제됨
  containers:
    - name: c1
      image: nginx:1.17.6-alpine
      env:
        - name: MY_NODE_NAME
          valueFrom:
            fieldRef:
              fieldPath: spec.nodeName
      volumeMounts:
        - name: shared-volume
          mountPath: /shared

    - name: c2
      image: busybox:1.31.1
      command: ["/bin/sh", "-c"]
      args:
        - while true; do date >> /shared/date.log; sleep 1; done
      volumeMounts:
        - name: shared-volume
          mountPath: /shared

    - name: c3
      image: busybox:1.31.1
      command: ["/bin/sh", "-c"]
      args:
        - tail -f /shared/date.log
      volumeMounts:
        - name: shared-volume
          mountPath: /shared
----
#!/bin/bash

# etcd 환경 변수 설정
export ETCDCTL_API=3
export ETCDCTL_CACERT=/etc/kubernetes/pki/etcd/ca.crt
export ETCDCTL_CERT=/etc/kubernetes/pki/etcd/server.crt
export ETCDCTL_KEY=/etc/kubernetes/pki/etcd/server.key

# 1. etcd 백업 생성
echo "Backing up etcd data..."
etcdctl snapshot save /tmp/etcd-backup.db \
  --endpoints=https://127.0.0.1:2379

# 2. 테스트 Pod 생성
echo "Creating a test pod..."
kubectl run test-pod --image=nginx --restart=Never
sleep 5

# 3. etcd 백업 복원
echo "Restoring etcd from backup..."
etcdctl snapshot restore /tmp/etcd-backup.db \
  --data-dir=/var/lib/etcd-backup

# 기존 etcd 데이터 이동 후 복원된 데이터 적용
mv /var/lib/etcd /var/lib/etcd-old
mv /var/lib/etcd-backup /var/lib/etcd

# 4. etcd 재시작
echo "Restarting etcd..."
systemctl restart etcd

# 5. 복원 확인
echo "Checking cluster status..."
kubectl get nodes
kubectl get pods
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Mi  
---
apiVersion: v1
kind: Pod
metadata:
  creationTimestamp: null
  labels:
    run: use-pv
  name: use-pv
spec:
  containers:
  - image: nginx
    name: use-pv
    volumeMounts:
    - mountPath: "/data"
      name: mypod
  volumes:
  - name: mypod
    persistentVolumeClaim:
      claimName: my-pvc
---
kubectl run nginx-resolver --image=nginx
kubectl expose pod nginx-resolver --name=nginx-resolver-service --port=80 --target-port=80 --type=ClusterIP
kubectl run test-nslookup --image=busybox:1.28 --rm -it --restart=Never -- nslookup nginx-resolver-service
kubectl run test-nslookup --image=busybox:1.28 --rm -it --restart=Never -- nslookup nginx-resolver-service > /root/CKA/nginx.svc

Get the IP of the nginx-resolver pod and replace the dots(.) with hyphon(-) which will be used below.

kubectl get pod nginx-resolver -o wide
kubectl run test-nslookup --image=busybox:1.28 --rm -it --restart=Never -- nslookup <P-O-D-I-P.default.pod> > /root/CKA/nginx.pod
---
Run the below command for solution:

세부정보
kubectl taint node node01 env_type=production:NoSchedule
Deploy dev-redis pod and to ensure that workloads are not scheduled to this node01 worker node.

kubectl run dev-redis --image=redis:alpine

kubectl get pods -owide
Deploy new pod prod-redis with toleration to be scheduled on node01 worker node.

apiVersion: v1
kind: Pod
metadata:
  name: prod-redis
spec:
  containers:
  - name: prod-redis
    image: redis:alpine
  tolerations:
  - effect: NoSchedule
    key: env_type
    operator: Equal
    value: production     
View the pods with short details:

kubectl get pods -owide | grep prod-redis
---
apiVersion: v1
kind: Pod
metadata:
  name: print-greeting
spec:
  containers:
  - name: env-print-demo
    image: bash
    env:
    - name: GREETING
      value: "Warm greetings to"
    - name: HONORIFIC
      value: "The Most Honorable"
    - name: NAME
      value: "Kubernetes"
    command: ["echo"]
    args: ["$(GREETING) $(HONORIFIC) $(NAME)"]

