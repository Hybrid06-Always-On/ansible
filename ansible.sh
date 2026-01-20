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

# 3. ansible 패키지 설치
# sudo yum -y install epel-release
# sudo yum -y install ansible

# # 4. ande 설정
# mkdir -p ~/bin

# cat << 'EOF' > ~/bin/ande
# #!/bin/bash
# if [ $# -ne 1 ]; then
#   echo "Usage: $0 <module name>"
#   exit 1
# fi

# ansible-doc "$1" 2>/dev/null | sed -n '/^[[:space:]]*EXAMPLES:/,$p' | more

# EOF


# chmod +x ~/bin/ande

# # .bashrc에 경로와 별칭 추가
# grep -q "bin" ~/.bashrc || echo 'export PATH=$PATH:~/bin' >> ~/.bashrc
# grep -q "alias anp=" ~/.bashrc || echo "alias anp='ansible-playbook'" >> ~/.bashrc

