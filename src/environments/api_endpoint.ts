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
    resendPassword: 'admin/resend-temp-password',

    //Subscriber
    getSubscriberUsers: 'subscriber/users',
    getSubscriberRole: 'subscriber/roles',
    getSubscriberUser: 'subscriber/user',
    createSubscriberUser: 'subscriber/create',
    subscriberProfileUpdate: 'subscriber/profile-update/',
    subscriberProfile: 'subscriber/profile',
    subscriberDisableUser: "subscriber/disable-user/",

    /// subscriber-staff-manager
    createSubscriberManageUser: 'subscriber-staff-manager/create',
    getSubscriberManageUsers: 'subscriber-staff-manager/users',
    getSubscriberManageRole: 'subscriber-staff-manager/roles',
    subscriberManageDisableUser: "subscriber-staff-manager/disable-user/",

    //Claim Service endpoint
    getClaimantDetails: "claimant/details",
    createClaim: "claims/create",
    createClaimant: "claimant/create",
    callerAffliation: "claims/seed-data/agent_type",

    //seed data
    seedData: 'claims/seed-data/',
    bodyParts: "seed-data/body_part"
}
