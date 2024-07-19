set -xv

# Stage 0
aws sns publish --topic-arn arn:aws:sns:ap-southeast-1:455500711566:sam-notification-centre-production-commit-notification --message "New Commit on the Production branch of Nerv!"

# Stage 1
thecommitdate=$(git show -s --format=%aI | cut -d 'T' -f 1 | tr -d '-')
thecommittime=$(git show -s --format=%aI | cut -d 'T' -f 2 | cut -d '+' -f 1 | tr -d ':')
thedatetime="$thecommitdate-$thecommittime"
thecommitshorthash=$(git rev-parse --short HEAD)
filename="Changes-wm-nerv-production-$thecommitshorthash-$thedatetime.diff"
git log -p -1 >> $filename
git diff HEAD^ HEAD >> $filename
gitrepopath=`pwd`

# Stage 2
mkdir /tmp/git
cd /tmp/git
git config --global user.email devops@whipmobility.com
git config --global user.name devops
git clone https://gitlab-ci-token:$ProductionChangeCommit@gitlab.whipmobility.io/system-architect/admin-panel-platform.git
cd admin-panel-platform
cp $gitrepopath/Changes-wm-nerv-production-* .
git add Change*.diff
git commit -m 'Add a new change file'
git push origin development --force

set +vx