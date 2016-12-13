require('./styles')

import {render, h} from 'preact'

document.addEventListener('DOMContentLoaded', () => {
  render((
    <div>
      <div class="fil-wrapper">
        <aside class="fil-sidebar">
          <nav>
            <ul class="fil-nav">
              <li class="fil-nav-item">
                <a href="#files" class="fil-cat-files active">Files</a>
              </li>
              <li class="fil-nav-item">
                <a href="#recent" class="fil-cat-recent">Recent</a>
              </li>
              <li class="fil-nav-item">
                <a href="#shared" class="fil-cat-shared">Shared by me</a>
              </li>
              <li class="fil-nav-item">
                <a href="#activity" class="fil-cat-activity">Activity</a>
              </li>
              <li class="fil-nav-item">
                <a href="#trash" class="fil-cat-trash">Trash</a>
              </li>
            </ul>
          </nav>
        </aside>
        <main class="fil-content">
          <div class="fil-content-header">
            <h2 class="fil-content-title">Files</h2>
            <div class="fil-content-toolbar">
              <button>Upload</button>
            </div>
          </div>
          <table class="fil-content-table">
            <thead>
              <tr>
                <th class="fil-content-file">Name</th>
                <th>Last update</th>
                <th>Size</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="fil-content-file">Documents</td>
                <td><time datetime="">Nov 1, 2015</time></td>
                <td>—</td>
                <td>—</td>
              </tr>
              <tr>
                <td class="fil-content-file">Music</td>
                <td><time datetime="">Jul 14, 2016</time></td>
                <td>—</td>
                <td>Shared (Read only)</td>
              </tr>
              <tr>
                <td class="fil-content-file">Photos</td>
                <td><time datetime="">Oct 7, 2016</time></td>
                <td>—</td>
                <td>Shared (read &amp; write)</td>
              </tr>
              <tr>
                <td class="fil-content-file">a job story example<span class="fil-content-ext">.word</span></td>
                <td><time datetime="">Jul 14, 2016</time></td>
                <td>1.2 MB</td>
                <td>—</td>
              </tr>
              <tr>
                <td class="fil-content-file">principle animation prototype<span class="fil-content-ext">.sketch</span></td>
                <td><time datetime="">Oct 7, 2016</time></td>
                <td>27 MB</td>
                <td>Shared (read only)</td>
              </tr>
            </tbody>
          </table>
        </main>
      </div>
    </div>
  ), document.querySelector('[role=application]'))
})
