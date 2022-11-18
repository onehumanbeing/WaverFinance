kill -9 $(sudo lsof -i tcp:8000 | awk '{print $2}')
