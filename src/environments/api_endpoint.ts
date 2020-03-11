export const api_endpoint = {
    //authentication
    signIn: 'auth/signin',
    signUp: 'auth/signup',
    signupVerify: 'auth/signup-verify',
    resetPassword: 'admin/reset-admin-password',
    emailVerify: 'auth/email-verify',
    userCsvUpload: 'admin/csv-upload',
    getAdminUser: "admin/users",
    getAdminRoles: "admin/roles",
    getUser: "admin/user/",
    createUser: "admin/create",
    updateUser: "admin/update-user/",
    getSubscribersRole: "admin/subscriber-roles",
    getVendorRole: "admin/vendor-roles",
    getSubscribers: "admin/subscribers",
    getvendors: "admin/vendors",
    disable_user: "admin/disable-user/",

    //Subscriber
    getSubscriberUsers: 'subscriber/users',
    getSubscriberRole: 'subscriber/roles',
    getSubscriberUser: 'subscriber/user',
    createSubscriberUser: 'subscriber/create',
    subscriberProfileUpdate:'subscriber/profile-update/',
    subscriberProfile : 'subscriber/profile',
    subscriberDisableUser: "subscriber/disable-user/",

    /// Subscriber staff
    manager_profile: "subscriber-staff-manager/profile",
    manager_profile_update: "subscriber-staff-manager/profile-update/",
}
