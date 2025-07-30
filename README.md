> [!IMPORTANT]  
> - Make sure port 25 (SMTP) is open and accessible. **This is not always the case on cloud compute**
> - For production, secure your server and upgrade to HTTPS for the web interface.


# Mail Catcher

Mail-catcher is a disposable mail service designed for testing and temporary email needs. In can be stood up in just a few commands on a dedicated server or VPS.

## Purpose

- Receive temporary emails for testing or registration.
- Protect your primary inbox from spam.
- Create throw away accounts.
- Use for QA, development, or demo environments.

## Setup

### Required software

- git
- docker

### Running

1. **Clone the Repository**
    ```sh
    git clone https://github.com/yourusername/mail-catcher.git
    cd mail-catcher
    ```

2. **Launch the docker container in detached mode**
    ```sh
    docker compose up -d
    ```

5. **Access the Web Interface**
    - The default port is `80` for this application (defined in `docker-compose`). It can be changed if your server is already busy on this port

### DNS Configuration

To receive emails for your domain, and make the web server accessible, add the following DNS records:

| Type | Name                | Value                | Priority |
|------|---------------------|----------------------|----------|
| MX   | @                   | yourdomain.com       | 10       |
| A    | yourdomain.com      | 123.45.67.89         |          |

This will make your server reachable on the domain given in the A record. 
The MX record will also be the domain used for your email address. It's possible to define subdomains here.