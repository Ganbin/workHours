export function PaginationCustomElement() {
    const self = this;

    self.activePage = 1;
    self.overallPageLinks = 200;
    self.showFirstLast = true;
    self.showPrevNext = true;
    self.showPageLinks = true;
    self.visiblePageLinks = '16';

    self.setActive = function (tab) {
        self.activeTab = tab;
    };
}
