export function NavBarCustomElement() {
    const self = this;

    self.setActive = function (tab) {
        self.activeTab = tab;
    };
    self.isActive = function (tab) {
        if (tab === this.activeTab) {
            return true;
        }
        return false;
    };
}
