export const api_endpoint = {
    //authentication
    signIn: 'auth/Authentication/signin',
    signUp: 'auth/Authentication/signup',
    signupVerify: 'auth/Authentication/signup-verify',
    resetPassword: 'admin-api/admin/reset-admin-password',
    emailVerify: 'auth/authentication/email-verify',
    userCsvUpload: 'admin-api/vendor/csv-upload',
    getAdminUser: "admin-api/admin/users",
    getAdminRoles: "admin-api/admin/roles",
    getUser: "admin-api/admin/user/",
    createUser: "admin-api/admin/create",
    updateUser: "admin-api/admin/update-user/",
    getSubscribersRole: "admin-api/admin/subscriber-roles",
    getVendorRole: "admin-api/admin/vendor-roles",
    getSubscribers: "admin-api/admin/subscribers",
    getvendors: "admin-api/admin/vendors",
    disable_user: "admin-api/admin/disable-user/",

    /// Subscriber staff
    manager_profile: "subscriber-staff-manager/profile",
    manager_profile_update: "subscriber-staff-manager/profile-update/",
}