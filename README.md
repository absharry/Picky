# Html-Template

## Welcome!
So this is a super simple static HTML template creator with built-in CMS. There is only a small amount of setup, and it's mostly online.

## Setup
 - Create a repository, and copy the entire of this repo's contents in (Yes, if I had given myself more time I would have sorted it out so you don't have to copy it, but hey, this is where we're at.)
 - Publish that repo (Preferably, to github, you'll see why later).
 - Go to [Netlify](https://www.netlify.com/) and signup for an account. I would suggest signing up with your github (the one that your repo is stored on) as it helps with the set up later on.
 - Select "New site from Git" in the top right hand corner
 - Choose "Github" when asked where you want to Continuously deploy from
 - You may have to go through the auth again, just follow it through and select whether you want it to see all of your repos or just a few / the one you want to deploy
 - Select the repo that you just pushed.
 - Choose the branch you wish to deploy. I would leave it at master for now (you can add branches later).
 - Leave the other settings as they are (they should read `gulp build` in the Build Command and `dist/` in the Publish directory)
 - Click deploy site and watch it go!

In a few seconds, it should finish deplying your site and you should have a lovely url that you can visit. 

From here, Netlify let's you do a whole host of things, but the most important one is to set the Identity settings, so that people can't edit your cms section.

 - Go to the Identity tab in Netlify
 - Click "Enable Identity"
 - Once enabled, click "Settings and usage"
 - Under "Registration", make sure to tick "Invite Only". That ay it isn't an open registration!
 - Scroll down to "Services" and click "Enable Git Gateway"
 - Go back to the Identity tab, and invite yourself.

Once you've done that, you should now go and have a play!

Netlify has a whole host of great features, including but not limited to:

1. Built in AWS Lambda functions,
2. Continuous deployment from all branches
3. Add a custom domain (with free wildcard ssl)
4. Have branches deploying to those domains (i.e. develop goes to `develop.customdomain`, uat goes to `uat.customdomain` etc.)
5. Automatically have forms submitting to Netlify, without any server side code (Contact Us forms etc.)
6. A/B testing
7. Automatic Asset Optimisation
8. Deployment notification to Slack (and other services)

## NetlifyCMS
The site has NetlifyCMS built into it, which allows you to create and post various different types of content. Once you've set up the identity above, you should be able to log in to the admin section at `/admin`. 

In order to create new post types / edit the existing one, you'll need to edit the schema for it in the `admin` folder **IN THE ROOT OF THE REPO**. Changes made in here will copy to the `dist` folder, but if you change anything in the `dist` folder it will get overwritten.

The schema should be pretty self explanatory, otherwise there are links in there to go and see how to do it.

## Creating a site
It's using the Nunjucks templating library in order to create the various pages of the site. 

For all of the documentation regading Nunjucks, visit the [docs site](https://mozilla.github.io/nunjucks/). You can also take a look at the [npm package](https://www.npmjs.com/package/gulp-nunjucks-render) for how to include variables  But here are some simple examples:

### Creating pages
Super simple. For each of the pages you're trying to build, create a `<PageName>.njk` file under `./pages/`. Add the following three lines:
```
{% extends "layout.njk" %}

{% block content %}

{% endblock %}
```

And then place your content for that page between the `{% block content %}` and `{% endblock %}`.

### Creating partials
Partials are also really easy. Create the partial you wish to make inside `./templates/partials`, and then include it on your page / layout using `{% include "../templates/partials/header.njk" %}`.

### Creating scss files
It's using SASS, and so all of the `.scss` files live inside `./sccs`. Structure it however you like, but make sure your partials begin with an underscore so that the compiler doesn't render that as it's own css file. And also make sure that you're referencing the partials in `site.scss`.

### Running the site

First, do an `npm install` to install all of the dev dependencies.

Once that's over with, you can run `gulp watch` to start compiling the `.scss`, minifying images & `.js`, compiling all of the `.njk`'s into html and copying it over to the `./dist` folder, which will then be served to a local port for you to try out. 

