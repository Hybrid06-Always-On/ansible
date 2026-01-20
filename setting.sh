#!/bin/bash

## Ansible Control node 기본 세팅  ###

# 1. /etc/hosts 파일 수정
cat << EOF > /etc/hosts
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6

10.5.1.200       router1.example.com      router1
10.5.2.200       router2.example.com      router2
10.5.3.200       router3.example.com      router3
10.5.4.200       router4.example.com      router4
10.5.1.10        iac-ci.example.com       iac-ci
10.5.1.20        proxy.example.com        proxy
10.5.2.30        control1.example.com     control1
10.5.2.40        control2.example.com     control2
10.5.2.50        control3.example.com     control3
10.5.3.60        worker1.example.com      worker1
10.5.3.70        worker2.example.com      worker2
10.5.3.80        worker3.example.com      worker3
10.5.4.90        storage1.example.com     storage1
10.5.4.100       storage2.example.com     storage2
10.5.4.110       bastion.example.com      bastion
EOF

# 2. sshpass 설치
yum -y install sshpass

### 변수 설정 ###
HOST_NAMES=$(awk '/^10\./ {print $NF}' /etc/hosts)
TARGET_HOSTS=("worker1" "worker2" "worker3")

### 모든 VM 환경 설정 ###

# 1. Ping 테스트
for ip in $(awk '/^10\./ {print $1}' /etc/hosts); 
do
    ping -c 2 -W 1 $ip > /dev/null 2>&1
    [ $? -eq 0 ] && echo "[ OK ] $ip" || echo "[ FAIL ] $ip"
done

# # 2. devops 사용자 생성 
# for host in $HOST_NAMES; 
# do
#     sshpass -p "centos" ssh -o StrictHostKeyChecking=no root@$host \
#     "id devops >/dev/null 2>&1 || (useradd -G wheel devops && echo 'devops:devops' | chpasswd)"
# done

# # 3. wheel 그룹 sudo 설정
# for host in $HOST_NAMES; 
# do
#     sshpass -p "centos" ssh -o StrictHostKeyChecking=no root@$host \
#      "sed -i 's/^%wheel/#%wheel/; s/^#\s*%wheel/%wheel/' /etc/sudoers"
# done

# 4. /etc/hosts 파일 배포
for host in $HOST_NAMES;
do
    [ "$host" != "iac-ci" ] && sshpass -p "centos" scp -o StrictHostKeyChecking=no /etc/hosts root@$host:/etc/hosts
done

# # 5. 방화벽 비활성화
# for host in $HOST_NAMES;
# do
#     sshpass -p "centos" ssh root@$host "systemctl disable --now firewalld"
# done

# # 6. Multi-user.target으로 전환 
# for host in "${TARGET_HOSTS[@]}";
# do
#     sshpass -p "centos" ssh root@$host "systemctl set-default multi-user.target && systemctl isolate multi-user.target"
# done

# # 7. SELinux permissive로 변경
# for host in $HOST_NAMES; do
#     sshpass -p "centos" ssh root@$host "bash -s" <<'ENDSSH'
# if grep -q '^SELINUX=disabled' /etc/selinux/config; then
#     sed -i 's/^SELINUX=disabled/SELINUX=permissive/' /etc/selinux/config
# else
#     sed -i 's/^SELINUX=enforcing/SELINUX=permissive/' /etc/selinux/config
#     setenforce 0
# fi
# ENDSSH
# done