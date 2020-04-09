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
    verifySubscriberStatus: 'auth/verify-subscriber-status',
    changeRole: "subscriber/switch-to-examiner/",

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
    createClaim: "claim/create",
    createClaimant: "claimant/create",
    // callerAffliation: "claims/seed-data/agent_type",
    searchClaimant: "claimant/search",
    getClaims: "claim",
    getClaim: "claim",
    searchEams: "claim/eams-wcab-search/",
    examinar_type: "subscriber/examiner/examiner-list",
    create_billable_item: "billable-item/create",
    get_examinar_address: "billable-item/location-dropdown/",

    //seed data
    seedData: 'claim/seed-data/',
    bodyParts: "seed-data/body_part",

    //manage-address
    addAddress: 'subscriber/examiner/add-address',
    getAddress: 'subscriber/examiner/get-address',
    updateAddress: 'subscriber/examiner/update-address',
    deleteAddress: 'subscriber/examiner/remove-address/',

    //examiner

    getExaminerList: 'subscriber/examiner/examiner-list',
    getSingleExaminer: 'subscriber/examiner/get-address/',
    searchAddress: 'subscriber/examiner/search-address'
}
