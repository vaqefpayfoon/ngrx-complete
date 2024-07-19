FROM gitlab.whipmobility.io:5050/infrastructure/containerisation/base-images/node-16.15.1-slim:v0.0.6 as stage

ARG CI_COMMIT_BRANCH
ARG ARTIFACT_BUCKET_NAME
ARG AWS_DEFAULT_REGION
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY

WORKDIR /app

ADD . .

RUN yarn install

RUN npx nx build nerv --c=${CI_COMMIT_BRANCH}

RUN export artifact=nerv-${CI_COMMIT_BRANCH}-$(date +%Y%m%d-%H%M%S%z).zip

RUN rm -rf node_modules/ src/

RUN aws deploy push --application-name nerv-${CI_COMMIT_BRANCH} --s3-location s3://${ARTIFACT_BUCKET_NAME}/${CI_COMMIT_BRANCH}/nerv/${artifact} --source .

RUN aws deploy create-deployment --application-name nerv-${CI_COMMIT_BRANCH} --s3-location bucket=${ARTIFACT_BUCKET_NAME},key=${CI_COMMIT_BRANCH}/nerv/${artifact},bundleType=zip --deployment-group-name ${CI_COMMIT_BRANCH} --deployment-config-name CodeDeployDefault.OneAtATime