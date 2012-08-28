/* -*- Mode: js; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- /
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

'use strict';

// These strings are DOM ids
var VIEW_TOPUP = 'topup-view';
var VIEW_SETTINGS = 'settings-view';
var TAB_BALANCE = 'balance-tab';
var TAB_DATA_USAGE = 'datausage-tab';
var DIALOG_SERVICE_UNAVAILABLE = 'service-unavailable-info-dialog';
var DIALOG_APPLICATION_ERROR = 'application-error-info-dialog';

// The ViewManager is in charge of simply manage the different views of the
// applications. VeewManager,changeViewTo() valid values are lister above
// these lines.
var ViewManager = (function cc_setUpViewManager() {

  var TABS = [TAB_BALANCE, TAB_DATA_USAGE];
  var _currentView = null;
  var _currentTab = null;

  // Return true if the passed view is a tab
  function _isTab(view) {
    return TABS.indexOf(view) > -1;
  }

  // Make target enter screen's main area and call callback after, passing as
  // arguments if the new view is a tab, the new view id and a third parameter
  // depending on if the view was a tab or not:
  //   If it is a tab: it returns the current overlay view id or null
  //   If it is not a tab: it returns the previous ovrlay view or null
  function _changeViewTo(viewId, callback) {
    _closeCurrentView();

    var previousViewId, currentViewId;

    // Note herw how we set the same value with different semantincs.
    // This is used at the end of the function and the names are the correct
    // because, depending on if the view is a tab or not, semantics may change.
    previousViewId = currentViewId = _currentView ? _currentView.id : null;
    var isTab = _isTab(viewId);

    // Tabs are treated in a different way than overlay views
    if (isTab) {
      // Hide all
      TABS.forEach(function ccvm_hideEachTab(tabId) {
        document.getElementById(tabId).dataset.viewport = 'behind';
        document.getElementById(tabId + '-filter')
          .setAttribute('aria-selected', 'false');
      });

      // Show the proper one
      document.getElementById(viewId).dataset.viewport = '';
      document.getElementById(viewId + '-filter')
        .setAttribute('aria-selected', 'true');

    // Overlay view
    } else {
      var view = document.getElementById(viewId);
      var previousViewId = _currentView ? _currentView.id : '';
      _currentView = {
        id: viewId,
        defaultViewport: view.dataset.viewport
      };

      // With a combination of CSS, we actually animate and display the view
      view.dataset.viewport = '';
    }

    if (typeof callback === 'function')
      callback(isTab, viewId, isTab ? currentViewId : previousViewId);
  }

  // Close the current view returning to the previous one
  function _closeCurrentView() {
    // Tabs can not be closed
    if (!_currentView || _isTab(_currentView.id))
      return;

    var view = document.getElementById(_currentView.id);

    // With a combination of CSS, Restoring the last viewport we actually
    // animate and hide the current view
    view.dataset.viewport = _currentView.defaultViewport;
    _currentView = null;
  }

  // Test if the current view is the one passed as parameter
  function _isCurrentView(view) {
    return _currentView && _currentView.id === view;
  }

  return {
    changeViewTo: _changeViewTo,
    closeCurrentView: _closeCurrentView,
    isCurrentView: _isCurrentView
  };
}());
