export interface SideNavInterface {
    group: string,
    menu: menuItem[]
}
export interface menuItem {
    path: string;
    title: string;
    icon: string,
    submenu: SideNavInterface[],
    group: string,
    role: number // 1- admin, 2- subscriber, 3-vendor, 20-subcriber staff manager, 21- subscriber staff, 23 - Examinor, 30- Vendor staff manager, 31-Vendor staf
}