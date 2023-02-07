How to contribute to Cozy Drive?
====================================

Thank you for your interest in contributing to Cozy! There are many ways to contribute, and we appreciate all of them.


Security Issues
---------------

If you discover a security issue, please bring it to our attention right away! Please **DO NOT** file a public issue, instead send your report privately to security AT cozycloud DOT cc.

Security reports are greatly appreciated and we will publicly thank you for it. We currently do not offer a paid security bounty program, but are not ruling it out in the future.


Bug Reports
-----------

While bugs are unfortunate, they're a reality in software. We can't fix what we don't know about, so please report liberally. If you're not sure if something is a bug or not, feel free to file a bug anyway.

Opening an issue is as easy as following [this link][issues] and filling out the fields. Here are some things you can write about your bug:

- A short summary
- What did you try, step by step?
- What did you expect?
- What did happen instead?
- What is the version of the Cozy Drive?


Pull Requests
-------------

Please keep in mind that:

- Pull-Requests point to the `master` branch
- You need to cover your code and feature by tests
- You may add documentation in the `/docs` directory to explain your choices if needed
- We recommend to use [task lists][checkbox] to explain steps / features in your Pull-Request description
- you do _not_ need to build app to submit a PR
- you should update the Transifex source locale file if you modify it for your feature needs (see [Localization section in README][localization])


### Workflow

Pull requests are the primary mechanism we use to change Cozy. GitHub itself has some [great documentation][pr] on using the Pull Request feature. We use the _fork and pull_ model described there.

#### Step 1: Fork

Fork the project on GitHub and [check out your copy locally][forking].

```
$ git clone github.com/cozy/cozy-drive.git
$ cd cozy-drive
$ git remote add fork git://github.com/yourusername/cozy-drive.git
```

#### Step 2: Branch

Create a branch and start hacking:

```
$ git checkout -b my-branch origin/master
```

#### Step 3: Code

Well, we think you know how to do that. Just be sure to follow the coding guidelines from the community ([standard JS][stdjs], comment the code, etc).

#### Step 4: Test

Don't forget to add tests and be sure they are green:

```
$ cd cozy-drive
$ npm run test
```

#### Step 5: Commit

Writing [good commit messages][commitmsg] is important. A commit message should describe what changed and why.

#### Step 6: Rebase

Use `git rebase` (_not_ `git merge`) to sync your work from time to time.

```
$ git fetch origin
$ git rebase origin/master my-branch
```

#### Step 7: Push

```
$ git push -u fork my-branch
```

Go to https://github.com/yourusername/cozy-drive and select your branch. Click the 'Pull Request' button and fill out the form.

Alternatively, you can use [hub] to open the pull request from your terminal:

```
$ git pull-request -b master -m "My PR message" -o
```

Pull requests are usually reviewed within a few days. If there are comments to address, apply your changes in a separate commit and push that to your branch. Post a comment in the pull request afterwards; GitHub doesn't send out notifications when you add commits.


Writing documentation
---------------------

Documentation improvements are very welcome. We try to keep a good documentation in the `/docs` folder. But, you know, we are developers, we can forget to document important stuff that look obvious to us. And documentation can always be improved.


Translations
------------

The Cozy Drive is translated on a platform called [Transifex][tx]. [This tutorial][tx-start] can help you to learn how to make your first steps here. If you have any question, don't hesitate to ask us!


Community
---------

You can help us by making our community even more vibrant. For example, you can write a blog post, take some videos, answer the questions on [the forum][forum], organize new meetups, and speak about what you like in Cozy!



[issues]: https://github.com/cozy/cozy-drive/issues/new
[pr]: https://help.github.com/categories/collaborating-with-issues-and-pull-requests/
[forking]: http://blog.campoy.cat/2014/03/github-and-go-forking-pull-requests-and.html
[stdjs]: http://standardjs.com/
[commitmsg]: http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html
[localization]: https://github.com/cozy/cozy-drive/blob/master/README.md#localization
[hub]: https://hub.github.com/
[tx]: https://www.transifex.com/cozy/
[tx-start]: https://help.transifex.com/en/articles/6248698-getting-started-as-a-translator
[forum]: https://forum.cozy.io/
