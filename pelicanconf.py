#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'Ray Alez'
SITENAME = 'Startup Lab'
SITEURL = '' #https://startuplab.io'

PATH = 'content'
# Files to copy directly. Relative to PATH.
STATIC_PATHS = ['files','images']

TIMEZONE = 'America/Los_Angeles'

DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_DOMAIN = SITEURL
FEED_ALL_ATOM = 'feeds/posts.atom.xml'
CATEGORY_FEED_ATOM = 'feeds/%s.atom.xml'
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Menu
MENUITEMS = [
    ('Services', '/services'),    
]

# Extract date and slug from filename. 2017-08-14-hello-world.md
FILENAME_METADATA = '(?P<date>\d{4}-\d{2}-\d{2})-(?P<slug>.*)'

# Urls
ARTICLE_URL = 'post/{slug}'
ARTICLE_SAVE_AS = 'post/{slug}.html'
PAGE_URL = '{slug}'
PAGE_SAVE_AS = '{slug}.html'
TAG_URL = 'tag/{slug}'
TAG_SAVE_AS = 'tag/{slug}.html'
CATEGORY_URL = '{slug}'
CATEGORY_SAVE_AS = '{slug}.html'

# List all articles saved as blog.html.
# But template for this page has to be named index.html
INDEX_SAVE_AS = 'blog.html'


# Don't generate
AUTHOR_SAVE_AS = ''

# Directly use page
DIRECT_TEMPLATES = ('index','services','newsletter',)


# Specify a customized theme, via path relative to the settings file
THEME = "themes/startuplab"
# Take theme files from here
# THEME_STATIC_PATHS = ['themes']
# And put them here. Putting static files from theme into /static
THEME_STATIC_DIR = 'static'

PLUGIN_PATHS = ['pelican-plugins']
PLUGINS = ['summary']

SUMMARY_END_MARKER = "<!-- readmore -->"
SUMMARY_MAX_LENGTH = 140

DEFAULT_PAGINATION = 8


