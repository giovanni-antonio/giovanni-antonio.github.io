/**********************************
 * Made by Giovanni @gioalo(github)
 **********************************/

(function () {
  'use strict';

  var $portfolio = document.querySelector('.portfolio');
  var $error = document.createElement('p');

  var httpReq;
  var data;
  /**
   * Create request
   */
  function request() {
    // IE+7 and other browsers should support the XMLHttpRequest API
    httpReq = new XMLHttpRequest();
    httpReq.onload = response;
    httpReq.onerror = responseErr;
    httpReq.open('GET', '/api/data.json');
    httpReq.setRequestHeader('Content-Type', 'application/json');
    httpReq.send();
  }
  /**
   * Response w/ API data
   */
  function response() {
    if (httpReq.readyState === XMLHttpRequest.DONE) {

      if (httpReq.status === 200) {
        if(this.responseText && this.responseText !== null) {
          data = JSON.parse(this.response);
          $portfolio.append(portfolioRender(data.reverse()));
        }
      } else {
        $error.textContent = 'Awkward! No data found.';
        $portfolio.appendChild($error);
        throw new Error('Response API Error: Fail to load data.');
      }

    } else {
      throw new Error('Response API Error:' + this.textContent);
    }
  }

  function responseErr(err) {
    console.error('Fetch error ', err);
  }

  request();

  // console.log(data);

  function portfolioRender(data) {
    // is data ready
    if (data && data.length) {

      /** DOM TEMPLATE
       *
       <a class="portfolio__item {{STATUS_CLS}}" href="{{LINK}}" aria-disabled="{{DISABLED}}" target="_blank" rel="noopener noreferrer">
      <div class="portfolio__item__header flex flex--row">
      <div class="portfolio__item__header__date">{{DATE}}</div>
      <div class="portfolio__item__header__status">{{STATUS}}</div></div>
      <h2 class="portfolio__item__title">{{TITLE}}</h2><p>{{CONTENT}}</p>
      <div class="icon-arrow"></div>
      </a>
      */

      // console.log('Data is ready');
      var len = data.length;
      var index = 0;
      var disabled = false;
      var status_class = '';

      var fragmentView = document.createDocumentFragment();

      function createProject(obj, disabled, status_cls) {

        var $content = createEl('p'),
          $link = createEl('a'),
          $title = createEl('h2'),
          $arrow = createEl('div'),
          $header = createEl('div'),
          $date = createEl('div'),
          $status = createEl('div');

        $header.className = 'portfolio__item__header flex flex--row';

        $date.className = 'portfolio__item__header__date';
        $date.textContent = obj.date;

        $status.className = 'portfolio__item__header__status';
        $status.textContent = obj.status;

        $header.appendChild($date);
        $header.appendChild($status);

        $title.textContent = obj.title;
        $title.className = 'portfolio__item__title';

        $content.textContent = obj.content;

        $arrow.className = 'icon-arrow';

        $link.className = 'portfolio__item ' + status_cls;
        if(!disabled) {
          $link.href = obj.link;
          $link.setAttribute('target', '_blank');
          $link.setAttribute('rel', 'noopener noreferrer');
        }
        $link.setAttribute('aria-disabled', disabled);

        $link.append($header);
        $link.append($title);
        $link.append($content);
        $link.append($arrow);

        fragmentView.append($link);
      }

      /**TESTING
       *
       *var obj = {
        title: 'hello',
        content:'testing',
        link: 'hello.com',
        status: 'live',
        date:'sep 2018'
      }
      createProject(obj, 'true', 'live');
      createProject(obj, 'disabled', 'repo');
      var testElement = document.createElement('div');
      testElement.append(fragmentView);
      console.log(testElement);
       */



      for (; index < len; index++) {
        switch (data[index].status) {
          case 'live':
            disabled = false;
            status_class = 'live';
            createProject(data[index], disabled, status_class);
            break;
          case 'repo':
            disabled = false;
            status_class = 'repo';
            createProject(data[index], disabled, status_class);
            break;
          case 'coming soon':
            disabled = true;
            status_class = 'coming-soon';
            createProject(data[index], disabled, status_class);
            break;
          default:
            break;
        }
      }

      function createEl(el) {
        return document.createElement(el);
      }
      // returns the DOM as fragments
      return fragmentView;
    }

    // no data
    console.error('No data found for portfolio.');
    return false;
  }

})();

(function () {
  var $pageLinks = Array.from(document.querySelectorAll('a'));
  var index = 0;
  var len = $pageLinks.length;

  // window.scrollTo(0, 1000);

  for (; index < len; index++) {
    $pageLinks[index].addEventListener('click', scrollTo);
  }

  function scrollTo(e) {
    if (e.target.hash !== "") {
      e.preventDefault();
      window.scrollTo({
        top: document.querySelector(e.target.hash).offsetTop,
        behavior: "smooth"
      });
    }
  }
})();