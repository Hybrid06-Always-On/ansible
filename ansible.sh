cd ~
vi ansible.sh
-------------------------------------------------------------------------------------------------------------------
#!/bin/bash

### 변수 설정 ###
HOST_NAMES=$(sudo awk '/^10\./ {print $NF}' /etc/hosts)

# 1. SSH 키 생성 및 배포 
ssh-keygen -t rsa -N "" -f ~/.ssh/id_rsa
for host in $HOST_NAMES;
do
    sshpass -p "devops" ssh-copy-id -o StrictHostKeyChecking=no devops@$host
done

# 2. 모든 VM에 한 번씩 접속
for host in $HOST_NAMES; 
do
    ssh -o StrictHostKeyChecking=no devops@$host "exit"
done

# 3. IP 대상 키 배포
for ip in 10.5.4.90 10.5.4.100; do
    sshpass -p "devops" ssh-copy-id -o StrictHostKeyChecking=no devops@$ip
done

# 4. IP 대상으로 한 번씩 접속
for ip in 10.5.4.90 10.5.4.100; do
    ssh -o StrictHostKeyChecking=no devops@$ip "exit"
done

# 5. ansible 패키지 설치
sudo yum -y install epel-release
sudo yum -y install ansible

# 6. ande 설정
mkdir -p ~/bin

cat <<'EOF' > ~/bin/ande
#!/bin/bash

if [ $# -ne 1 ]; then
  echo "Usage: $0 <module name>"
  exit 1
fi

ANSIBLE_MODULE="$1"
ansible-doc "$ANSIBLE_MODULE" | sed -n '/^EXAMPLES:/,$p' | more
EOF

chmod +x ~/bin/ande

# 7. .bashrc에 경로와 별칭 추가
grep -q "bin" ~/.bashrc || echo 'export PATH=$PATH:~/bin' >> ~/.bashrc
grep -q "alias anp=" ~/.bashrc || echo "alias anp='ansible-playbook'" >> ~/.bashrc
