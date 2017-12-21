Title: Deploying Mastodon on Digital Ocean
Slug: deploying-mastodon-on-digital-ocean
Tags: Webdev, Devops, Mastodon
SocialImage: /images/deploying-mastodon/mastodon.png

![](/images/deploying-mastodon/mastodon.png)

[Mastodon](https://github.com/tootsuite/mastodon) is the new social media platform, a decentralized alternative to Twitter that is currently blowing up. This is a step by step guide on how to run your own Mastodon instance on [Digital Ocean](http://digitalocean.com).

## Set up a Droplet
Create a new docker droplet:
![](https://raw.githubusercontent.com/raymestalez/django-react-blog/master/assets/docker-droplet.png)

This droplet has almost everything we will need preinstalled.

You will receive an email from DO with the credentials you can use to log in to start setting up the server.

Connect to the server as a root user, using ip and password from the email:

```
ssh root@[ip-from-email]
```

You will be prompted to change the default password, so do that.

Then create a new user with the username you like, and grant him the sudo powers:
```
adduser ray
gpasswd -a ray sudo
```

## Connect domain name
Let's also immediately point your domain name to the droplet. After buying the domain(I recommend using [namecheap](http://namecheap.com)), change the Custom DNS settings to look like this:
![](http://i.imgur.com/FxKpsob.png)

Then, in DO's networking tab, create a domain, and add an A record pointing to the droplet:
![](http://i.imgur.com/AJppAHP.png)


Now you will be able to ssh into your server using your new username and a domain name:

```
ssh ray@hackertribe.io
```

## Install and configure basic stuff

Update and upgrade all the software:

```
sudo apt-get update &amp;&amp; sudo apt-get upgrade
```

Install nginx(we'll use it to serve our droplet on the right port), and your favorite text editor:

```
sudo apt-get install nginx emacs
```

Now let's add docker to the sudo group, that will allow us to run all the docker commands without sudo:

```
sudo usermod -aG docker $USER
sudo service docker restart
```


## Clone and configure Mastodon

Clone the repo and cd into it:

```
git clone https://github.com/tootsuite/mastodon.git
cd mastodon
```

Now let's configure some settings.  First, rename the file ```.env.production.sample``` into ```.env.production``` and open it.

Set the database username/password settings:

```
DB_USER=your_username
DB_NAME=your_databasename
DB_PASS=your_password
```

Set your domain name:
```
LOCAL_DOMAIN=hackertribe.io
```

And enable https:

```
LOCAL_HTTPS=true
```

Run ```docker-compose run --rm web rake secret``` to generate PAPERCLIP_SECRET, SECRET_KEY_BASE, and OTP_SECRET.

### Configure the email server
Create a [SendGrid](https://sendgrid.com/) account, go to Settings &gt; API Keys, and generate an API key.

Then set up the config like this:

```
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=587
SMTP_LOGIN=apikey
SMTP_PASSWORD=
SMTP_FROM_ADDRESS=youremail@gmail.com
```

(for SMTP_LOGIN literally just use &quot;apikey&quot;)

### Configure the site info
Open the file `/mastodon/config/settings.yml`, and enter the information about your instance(title, description, etc).

## Build the containers
Before we can build the containers, we need to add a swap file, without it my $10/month droplet was running out of memory during the build process. To add swap, execute these commands:

```
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

(you can read more in depth about it [here](https://www.digitalocean.com/community/tutorials/how-to-add-swap-space-on-ubuntu-16-04))

Now let's finally build our containers! (It will take a few minutes)

```
docker-compose build
docker-compose up -d
```

(the -d flag means that we want to run it in the background mode. You can try running it without this flag, and you will see the log of everything that's going on on the screen)

## Create the DB and migrate
Now we need to run several commands in the db container to create the database.

SSH into the container:

```
docker exec -i -t mastodon_db_1  /bin/bash
```

Switch to the postgres user:

```
su - postgres
```

Create a user for your db(use the username and password you've just set in the .env.production)
```
createuser -P your_username
```

Create a database, giving the ownership rights to the user:

```
createdb your_databasename -O your_username
```

Now you can get back to your own user, and run the migrations:

```
docker-compose run --rm web rails db:migrate
```


## Precompile assets
Now you can precompile the assets:
```
docker-compose run --rm web rails assets:precompile
```

After this has finished, restart the containers:

```
docker stop $(docker ps -a -q) &amp;&amp; docker-compose up -d
```

And now your mastodon instance will run on yourdomain.com:3000!!

## Setting up nginx and SSL

First, follow [this guide](https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-16-04) to generate SSL keys and set up the basic nginx configuration.

Then, because the docker containers are serving the application on the port 3000, we will need to use nginx to proxy all the requests to them. 

Create the file ```/etc/nginx/sites-enabled/mastodon_nginx.conf```, and copy the settings from [here](https://github.com/tootsuite/mastodon/blob/master/docs/Running-Mastodon/Production-guide.md).

Now, after you restart nginx:
```
sudo /etc/init.d/nginx restart
```

It will serve your Mastodon instance! 

## Conclusion

Congratulations =) Create an account, test things, and invite some people to use your instance!

I also recommend submitting a link to your instance to [this list](https://instances.mastodon.xyz) to make it easier for people to discover it.

<!-- If you're looking for some help with deployment - send an email to **contact@startuplab.io**, and I will setup mastodon for you($100). -->

Also, always feel free to toot at me at [@rayalez@mastodon.social](https://mastodon.social/@rayalez), I will be happy to answer your questions =)

