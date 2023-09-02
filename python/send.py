import requests
import json

def main():
    try:
        while True:
            print_options()
            choice = input("Enter your choice: ")

            if choice == "1":
                send_get_request("http://localhost:3000/get", None)
            elif choice == "2":
                token = input('Enter Your Token: ')
                send_get_request("http://localhost:3000/login", token)
            elif choice == "3":
                username = input('Enter Your Username: ')
                password = input('Enter Your Password: ')
                send_post_request("http://localhost:3000/login", username, password)
            else:
                print("Invalid choice. Please choose 1, 2, or 3.")
    except KeyboardInterrupt:
        print("\nCtrl+C pressed. Exiting...")

def print_options():
    print('''
        1 GET  ====> http://localhost:3000/get
        2 GET  ====> http://localhost:3000/login
        3 POST ====> http://localhost:3000/login
    ''')

def send_get_request(url, token):
    headers = {}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    else:
        print('Please Enter Token!')
        return

    response = requests.get(url, headers=headers)

    if response.status_code == 401:
        print("Token is expired or invalid. Please login again.")
    elif response.status_code == 200:
        handle_response("GET", response)
    else:
        print(f"Failed to make GET request. Status code: {response.status_code}")

def send_post_request(url, username, password):
    post_data = {
        "username": username,
        "password": password
    }
    response = requests.post(url, data=post_data)
    handle_response("POST", response)

def handle_response(request_type, response):
    print("\n" + "-" * 40)
    print(f"{request_type} Request Successful!")

    try:
        json_data = response.json()
        print("\nResponse JSON:")
        print(json.dumps(json_data, indent=4))
    except json.JSONDecodeError:
        print("\nResponse is not in valid JSON format.")

    print("-" * 40 + "\n")

if __name__ == "__main__":
    main()