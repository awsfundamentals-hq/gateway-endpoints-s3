#! /bin/bash

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

find_service_logo() {
    pushd $SCRIPT_DIR > /dev/null
        # Check if repository exists
        if [ ! -d "aws-icons-svg" ]; then
            # Clone the repository
            git clone git@github.com:weibeld/aws-icons-svg.git
        fi

        # Find the service logo
        SERVICE_LOGO=$(find aws-icons-svg -iname "*$1*_64.svg")

        # If there are multiple service logos, use the first one
        if [ -n "$SERVICE_LOGO" ]; then
            SERVICE_LOGO=$(echo "$SERVICE_LOGO" | head -n 1)
        fi

        # check if service logo exists
        if [ ! -f "$SERVICE_LOGO" ]; then
            echo "Service logo not found"
            exit 1
        else
            echo "Service logo found at $SERVICE_LOGO"
        fi

        # Store the service logo at public/awsf/service-logo.svg
        cp $SERVICE_LOGO ../public/awsf/service-logo.svg > /dev/null
    popd > /dev/null
}

find_service_logo $1
