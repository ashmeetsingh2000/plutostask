this Node app is deployed on vercel: https://plutostask.vercel.app/

======================= [ API Documentation ] ============================

USER api route 

    1- create user (POST) -> response message User created successfully
        body    
            { 
                "username":"user 1", 
                "password":"qwerty" 
            }

    2- Get User List (GET) -> response user data list
    3- Delete User (DELETE user object id in param) -> response message User deleted successfully

    4- Authenticate User -> response save it for furhter use JWT token
        body
            {
                "username":"user 1", 
                "password":"qwerty" 
            }

Offer api route

    5- create Offer (POST) -> response message Offer created successfully
        body
            { 
                "tittle":"sony",
                "price":"500", 
                "expiredate":"21 Feb, 2024" 
            }
    6- Get Offer List (GET) -> JWT Token in header -> response Offer data list
    7- Delete Offer (DELETE Offer object id in param) -> response message Offer deleted successfully

Voucher api route

    8- create Voucher (POST) -> response message "Offer Vouchers added successfully"
        body
            { 
                "offer_id":"1234567890",
                "voucherArr":[
                    {
                        "vouncher_code":"v1",
                        "vouncher_usage_limit":"2"
                    },{
                        "vouncher_code":"v2",
                        "vouncher_usage_limit":"1"
                    },{
                        "vouncher_code":"v3",
                        "vouncher_usage_limit":"3"
                    }
                ]
            }
    9- Get Vouchers List (GET) -> JWT Token in header -> response Vouchers data list
    10- Get List of vouchers of a specific offer(GET) 
        ->  JWT Token in header , offer id of a vouhers in the param
        ->  response Vouchers data list
    11- Delete VOucher (DELETE Voucher object id in param) -> response message vouchers deleted successfully

    12- Consume a voucher of a specific offer(PUT) 
        ->  JWT Token in header , offer id of a vouhers in the param
        ->  response
                {
                    "message": "this voucher hav been used",
                    "voucher_Code": "v1"
                }

Important note:

    # we discussed that there should be file upload option or enter multiple vouchers but due to lack of time and incomplete infomration (info as in file data format and file format). therfore i went for simple arr input which works as expected.

    # After consuming an voucher you can see the changes in userDetails api