# /bin/bash
while true; do
    echo "Starting Bot ..."
    screen -S "discord" -A npm run start
    echo "Bot crashed ... Restarting in 5 seconds..."
    sleep 5
done