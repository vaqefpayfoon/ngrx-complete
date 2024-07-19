#!/bin/bash
sleep 2
SERVERNAME=$(hostname)
###########################
## Get URL ################
###########################
if [ "$SERVERNAME" == production ]
then
    URL=("http://nerv.whipmobility.com")
    echo $URL
else
    URL=("http://nerv.whipmobility.io")
    echo $URL
fi
###############################
# check the http status code ##
###############################
curl -Is `echo $URL` | head -n 1 | grep 200
STATUS=$(echo $?)

if [ "$STATUS" == 0 ]
then
    SUCCESS=(" >>>\` MɪꜱᴛᴇʀTʏʀᴇ ツ\` \n\n:heart_eyes: ┋ ƠƝԼƖƝЄ  ➜  《 "${SERVERNAME^^}"┊NERV 》 ")
    echo $SUCCESS
    unset SERVERNAME
else
    FAIL=(" >>>\` MɪꜱᴛᴇʀTʏʀᴇ ツ\` \n\n:unamused: ┋ ƠƑƑԼƖƝЄ  ➜  《 "${SERVERNAME^^}"┊NERV 》 ")
    echo $FAIL
    unset SERVERNAME
fi
###########################
#                         #
###########################
function validate-service {
    curl -X POST --data-urlencode "payload={\"channel\": \"#dev_ops\", \"username\": \"Code Deploy\", \"text\": \" $SUCCESS $FAIL \"}" https://hooks.slack.com/services/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
}
##########################
# Call Function ##########
##########################
validate-service

#########################
# unset variable ########
#########################
unset SUCCESS
unset FAIL
unset URL
unset SERVERNAME