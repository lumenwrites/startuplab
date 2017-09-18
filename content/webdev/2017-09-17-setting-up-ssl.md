Title: Setting up SSL with nginx on Ubuntu server
Slug: setting-up-ssl
Tags: Webdev, Devops, Mastodon
SocialImage: /images/ssl2.png

![](/images/ssl2.png)

For a long time I've procrastinated to learn how to properly configure HTTPS. Turns out it is super easy. This is my simple step by step guide.

<!-- readmore -->

## Generate certificates

First, make sure that your nginx config can serve files from `/var/www/html` - it should work by default.

Then install certbot - it is a script that will place some files into your `/var/www/html`, and then use them to verify that you have the ssh access to the server, which proves that you are the domain owner.

```
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot   
```

Now you can use this script to generate your certificates:
```
sudo certbot certonly --webroot -w /var/www/html -d yourdomain.com
```

This will create a file:

```
/etc/letsencrypt/live/yourdomain.com/fullchain.pem
```

This is a file that you're going to use to prove people that you're all good and not an evil hacker.

You also want to run a script that generates something called &quot;Diffie-Hellman Group&quot; - some sort of fancy security thingy that makes your SSL more secure.

```
sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048
```

This will create a file:

```
/etc/ssl/certs/dhparam.pem
```

which you will serve along with SSL certificate.

## Create configuration snippets

Now you want to create two nginx configuration snippets - bits of config that will properly configure nginx and tell it where to find your certificates.

First create a file `/etc/nginx/snippets/ssl-yourdomain.com.conf`, with this content:

```
ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
```

It will tell nginx where your certificates are.

Then create a second file `/etc/nginx/snippets/ssl-params.conf`:

```
# from https://cipherli.st/
# and https://raymii.org/s/tutorials/Strong_SSL_Security_On_nginx.html

ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
ssl_prefer_server_ciphers on;
ssl_ciphers &quot;EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH&quot;;
ssl_ecdh_curve secp384r1;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;
resolver 8.8.8.8 8.8.4.4 valid=300s;
resolver_timeout 5s;
# Disable preloading HSTS for now.  You can use the commented out header line that includes
# the &quot;preload&quot; directive if you understand the implications.
#add_header Strict-Transport-Security &quot;max-age=63072000; includeSubdomains; preload&quot;;
add_header Strict-Transport-Security &quot;max-age=63072000; includeSubdomains&quot;;
add_header X-Frame-Options DENY;
add_header X-Content-Type-Options nosniff;

ssl_dhparam /etc/ssl/certs/dhparam.pem;
```

It will properly configure SSL.

## Configure yoursite_nginx.conf
Now you want nginx to take all the requests coming to your website, and redirect them to https with properly configured SSL.

Just create or modify the file `/etc/nginx/sites-enabled/yoursite_nginx.conf` to look like this:

```
server {
       # redirect from http to https                              
        listen 80 default_server;
        listen [::]:80 default_server;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$server_name$request_uri;
}

server {
    listen 80;
    server_name yourdomain.com;

    # load ssl config                                             
    listen 443 ssl http2 default_server;
    listen [::]:443 ssl http2 default_server;
    include snippets/ssl-yourdomain.com.conf;
    include snippets/ssl-params.conf;

    ..... here goes all the rest of your config.
}		
```

The first block of code will redirect all the http traffic to https, and the second will load the snippets you've created to configure ssl and serve the certificates.

Now all you need to do is restart nginx:

```
sudo /etc/init.d/nginx restart
```

and your site will be served over https! 

Awesome.

![](http://i.imgur.com/PouzC1D.png)
