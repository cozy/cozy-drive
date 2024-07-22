# Nextcloud

The integration of Nextcloud within cozy-drive relies heavily on cozy-client and the proxy made by cozy-stack ([doc](https://docs.cozy.io/en/cozy-stack/nextcloud/)). This implies 2 main constraints that are worth mentioning if you want to understand the code better.

**1. Obtain a folder itself**

The query to `io.cozy.remote.nextcloud.files` can only retrieve the contents of one folder. To avoid this problem, we query its parent and filter by id to get data about.

**2. Reload data after mutation**

The mutations have any effect on the store because there are not back by real-time or update with the request response like for `io.cozy.files`. To avoid this problem, we reset the affected queries with `client.reset(queryId)`.

When the query involves moving a file, the destination query is privileged. The cache of the source query will be updated when cozy-client receives the reset query return. This avoids an additional network request. If the query does not exist, then we reset the source query.
