#!/bin/bash

# Version 0.2.0

echo "** NODE PREPARATION STARTED **"

apt update
apt install -y python3 python3-pip python-is-python3

if [ -z "$MOUNT_DIR" ]
then
    MOUNT_DIR=/mnt/data
    echo "Mount directory not specified. Assuming $MOUNT_DIR"
fi

# Assume the biggest disk is the data disk
DEV_DISK=/dev/$(lsblk -d -b | gawk 'BEGIN { M=0; D=""; } { if (strtonum($4) > M) { M = strtonum($4); D=$1; } } END { print D }')
DEV_DISK_SIZE=$(lsblk -d -b | gawk 'BEGIN { M=0; D=""; } { if (strtonum($4) > M) { M = strtonum($4); D=$1; } } END { print M / 1024 / 1024 / 1024 }')G
PART_NO=1
DEV_PART=${DEV_DISK}${PART_NO}

echo "* Data Disk  : $DEV_DISK"
echo "* Partition  : $DEV_PART"
echo "* Disk size  : $DEV_DISK_SIZE"
echo "* Mount point: $MOUNT_DIR"

if ! [ -b $DEV_PART ]
then
    echo "Disk not initialized. Initializing..."
    echo "- Creating msdos partition table"
    parted $DEV_DISK mklabel msdos
    echo "- Creating primary ext4 partition with end = $DEV_DISK_SIZE"
    parted -a optimal $DEV_DISK mkpart primary ext4 1M $DEV_DISK_SIZE
    echo "- Initializing ext4 filesystem on $DEV_PART"
    mkfs.ext4 $DEV_PART
    echo "Initializing complete."
else
    echo "Partition $DEV_PART already existing. Assuming it is also initialized."
fi
[ -d $MOUNT_DIR ] || mkdir $MOUNT_DIR
chmod 777 $MOUNT_DIR
echo "Mounting $DEV_PART on $MOUNT_DIR..."
mount $DEV_PART $MOUNT_DIR
chmod 777 $MOUNT_DIR
echo "Mount complete."
echo "Mount summary:"
mount
echo "Disk Free:"
df -h
echo "** NODE PREPARATION COMPLETED **"
