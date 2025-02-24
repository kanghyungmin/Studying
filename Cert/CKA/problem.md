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