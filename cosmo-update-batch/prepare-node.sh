#!/bin/bash

apt update
apt install -y python3 python3-pip python-is-python3

if [ -z "$MOUNT_DIR" ]
then
    MOUNT_DIR=/mnt/data
fi

# Assume the biggest disk is the data disk
DEV_DISK=$(lsblk -d -b | gawk 'BEGIN { M=0; D=""; } { if (strtonum($4) > M) { M = strtonum($4); D=$1; } } END { print D }')
DEV_DISK_SIZE=$(lsblk -d -b | gawk 'BEGIN { M=0; D=""; } { if (strtonum($4) > M) { M = strtonum($4); D=$1; } } END { print M / 1024 / 1024 / 1024 }')G
PART_NO=1
DEV_PART=${DEV_DISK}${PART_NO}

if ! [ -b $DEV_PART ]
then
    echo "Disk not initialized. Initializing..."
    parted $DEV_DISK mklabel msdos
    parted -a optimal $DEV_DISK mkpart primary ext4 1M $DEV_DISK_SIZE
    mkfs.ext4 $DEV_PART
    echo "Initializing complete."
else
    echo "Partition $DEV_PART already existing. Assuming it is also initialized."
fi
[ -d $MOUNT_DIR ] || mkdir $MOUNT_DIR
chmod 777 $MOUNT_DIR
echo "Mounting filesystem..."
mount $DEV_PART $MOUNT_DIR
echo "Mount complete."
