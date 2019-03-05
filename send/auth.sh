curl http://localhost:3000/api/auth/login -X POST -v -H "Content-type: application/json" -d @user.json | json_pp
curl http://localhost:3000/api/auth/logout -v -H "Content-type: application/json" | json_pp
curl http://localhost:3000/api/auth/register -X POST -v -H "Content-type: application/json" -d @user.json | json_pp
curl http://localhost:3000/api/auth/me -v -H "Content-type: application/json" -H "x-access-token: {TOKEN}" | json_pp