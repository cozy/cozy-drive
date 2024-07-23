# Nextcloud

The integration of Nextcloud within cozy-drive relies heavily on cozy-client and the proxy made by cozy-stack ([doc](https://docs.cozy.io/en/cozy-stack/nextcloud/)). This implies 2 main constraints that are worth mentioning if you want to understand the code better.

**1. Obtain a folder itself**

The query to `io.cozy.remote.nextcloud.files` can only retrieve the contents of one folder. To avoid this problem, we query its parent and filter by id to get data about.

**2. Reload data after mutation**

The mutations doesn't have any effect on the local store because we cannot update it with the request's response like for `io.cozy.files` and there are no real-time event that would update. To avoid this problem, we reset the affected queries with `client.reset(queryId)`.

When the query involves moving a file, the destination query is privileged. The cache of the source query will be updated when cozy-client receives the reset query answer. This avoids an additional network request. If the query does not exist, then we reset the source query.
