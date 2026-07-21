const fs = require('fs');
const path = require('path');

const collection = {
  info: {
    _postman_id: "c8f1a23b-4567-4e89-91ab-f98234500001",
    name: "Backend Node.js API Collection",
    description: "Complete Postman v2.1.0 Collection for Mental Health Consultation & E-Commerce App (19 Modules, 63 Endpoints)",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  variable: [
    {
      key: "base_url",
      value: "http://localhost:8000/api/v1",
      type: "string"
    },
    {
      key: "token",
      value: "",
      type: "string"
    }
  ],
  item: [
    {
      name: "1. Auth",
      item: [
        {
          name: "Register User",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({ name: "John Doe", email: "user@example.com", password: "password123" }, null, 2)
            },
            url: { raw: "{{base_url}}/auth/register", host: ["{{base_url}}"], path: ["auth", "register"] }
          }
        },
        {
          name: "Verify OTP",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({ email: "user@example.com", otp: "123456" }, null, 2)
            },
            url: { raw: "{{base_url}}/auth/verify-otp", host: ["{{base_url}}"], path: ["auth", "verify-otp"] }
          }
        },
        {
          name: "Resend Register OTP",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({ email: "user@example.com" }, null, 2)
            },
            url: { raw: "{{base_url}}/auth/resend-otp/register", host: ["{{base_url}}"], path: ["auth", "resend-otp", "register"] }
          }
        },
        {
          name: "Login",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({ email: "user@example.com", password: "password123" }, null, 2)
            },
            url: { raw: "{{base_url}}/auth/login", host: ["{{base_url}}"], path: ["auth", "login"] }
          }
        },
        {
          name: "Forgot Password",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({ email: "user@example.com" }, null, 2)
            },
            url: { raw: "{{base_url}}/auth/forgot-password", host: ["{{base_url}}"], path: ["auth", "forgot-password"] }
          }
        },
        {
          name: "Verify Forgot Password OTP",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({ email: "user@example.com", otp: "123456" }, null, 2)
            },
            url: { raw: "{{base_url}}/auth/verify-forgot-password-otp", host: ["{{base_url}}"], path: ["auth", "verify-forgot-password-otp"] }
          }
        },
        {
          name: "Resend Forgot Password OTP",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({ email: "user@example.com" }, null, 2)
            },
            url: { raw: "{{base_url}}/auth/resend-otp/forgot-password", host: ["{{base_url}}"], path: ["auth", "resend-otp", "forgot-password"] }
          }
        },
        {
          name: "Reset Password",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({ email: "user@example.com", otp: "123456", newPassword: "newpassword123" }, null, 2)
            },
            url: { raw: "{{base_url}}/auth/reset-password", host: ["{{base_url}}"], path: ["auth", "reset-password"] }
          }
        },
        {
          name: "Refresh Token",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({ token: "refresh_token_here" }, null, 2)
            },
            url: { raw: "{{base_url}}/auth/refresh-token", host: ["{{base_url}}"], path: ["auth", "refresh-token"] }
          }
        },
        {
          name: "Change Password",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ oldPassword: "password123", newPassword: "newpassword123" }, null, 2)
            },
            url: { raw: "{{base_url}}/auth/change-password", host: ["{{base_url}}"], path: ["auth", "change-password"] }
          }
        },
        {
          name: "Logout",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            url: { raw: "{{base_url}}/auth/logout", host: ["{{base_url}}"], path: ["auth", "logout"] }
          }
        },
        {
          name: "Google Login",
          request: {
            method: "POST",
            header: [{ key: "Content-Type", value: "application/json" }],
            body: {
              mode: "raw",
              raw: JSON.stringify({ idToken: "google_oauth_id_token_string" }, null, 2)
            },
            url: { raw: "{{base_url}}/auth/google-login", host: ["{{base_url}}"], path: ["auth", "google-login"] }
          }
        }
      ]
    },
    {
      name: "2. User",
      item: [
        {
          name: "Get My Profile",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/users/profile", host: ["{{base_url}}"], path: ["users", "profile"] }
          }
        },
        {
          name: "Update Profile",
          request: {
            method: "PATCH",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ fullName: "John Doe", phoneNumber: "+8801700000000", city: "Dhaka", country: "Bangladesh", aboutMe: "Expert Psychologist" }, null, 2)
            },
            url: { raw: "{{base_url}}/users/profile", host: ["{{base_url}}"], path: ["users", "profile"] }
          }
        },
        {
          name: "Complete Profile",
          request: {
            method: "PATCH",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/users/profile/complete", host: ["{{base_url}}"], path: ["users", "profile", "complete"] }
          }
        },
        {
          name: "Upload Profile Image",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ profileImage: "https://example.com/photo.jpg" }, null, 2)
            },
            url: { raw: "{{base_url}}/users/profile/image", host: ["{{base_url}}"], path: ["users", "profile", "image"] }
          }
        },
        {
          name: "Delete Profile Image",
          request: {
            method: "DELETE",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/users/profile/image", host: ["{{base_url}}"], path: ["users", "profile", "image"] }
          }
        },
        {
          name: "Get All Users (Admin)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/users?searchTerm=john&role=USER&page=1&limit=10", host: ["{{base_url}}"], path: ["users"], query: [{ key: "searchTerm", value: "john" }, { key: "role", value: "USER" }, { key: "page", value: "1" }, { key: "limit", value: "10" }] }
          }
        },
        {
          name: "Get Psychics Public",
          request: {
            method: "GET",
            url: { raw: "{{base_url}}/users/psychics/public?searchTerm=anxiety&onlineStatus=online&page=1&limit=10", host: ["{{base_url}}"], path: ["users", "psychics", "public"], query: [{ key: "searchTerm", value: "anxiety" }, { key: "onlineStatus", value: "online" }] }
          }
        },
        {
          name: "Get Psychic Profile",
          request: {
            method: "GET",
            url: { raw: "{{base_url}}/users/psychic/1", host: ["{{base_url}}"], path: ["users", "psychic", "1"] }
          }
        },
        {
          name: "Get Psychic Stats",
          request: {
            method: "GET",
            url: { raw: "{{base_url}}/users/psychic/1/stats", host: ["{{base_url}}"], path: ["users", "psychic", "1", "stats"] }
          }
        },
        {
          name: "Update Online Status (Psychologist)",
          request: {
            method: "PATCH",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ onlineStatus: "online" }, null, 2)
            },
            url: { raw: "{{base_url}}/users/online-status", host: ["{{base_url}}"], path: ["users", "online-status"] }
          }
        },
        {
          name: "Update Call Settings (Psychologist)",
          request: {
            method: "PATCH",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ callRate: 2.50, isCallEnabled: true }, null, 2)
            },
            url: { raw: "{{base_url}}/users/call-settings", host: ["{{base_url}}"], path: ["users", "call-settings"] }
          }
        },
        {
          name: "Delete User (Super Admin)",
          request: {
            method: "DELETE",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/users/5", host: ["{{base_url}}"], path: ["users", "5"] }
          }
        }
      ]
    },
    {
      name: "3. Category",
      item: [
        {
          name: "Get Public Categories",
          request: {
            method: "GET",
            url: { raw: "{{base_url}}/categories/public?type=SERVICE&status=ACTIVE", host: ["{{base_url}}"], path: ["categories", "public"], query: [{ key: "type", value: "SERVICE" }, { key: "status", value: "ACTIVE" }] }
          }
        },
        {
          name: "Get Public Category By ID",
          request: {
            method: "GET",
            url: { raw: "{{base_url}}/categories/public/1", host: ["{{base_url}}"], path: ["categories", "public", "1"] }
          }
        },
        {
          name: "Create Category (Admin)",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ name: "Psychology Books", type: "PRODUCT", status: "ACTIVE" }, null, 2)
            },
            url: { raw: "{{base_url}}/categories", host: ["{{base_url}}"], path: ["categories"] }
          }
        },
        {
          name: "Get All Categories (Admin)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/categories", host: ["{{base_url}}"], path: ["categories"] }
          }
        },
        {
          name: "Get Category By ID (Admin)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/categories/1", host: ["{{base_url}}"], path: ["categories", "1"] }
          }
        },
        {
          name: "Update Category (Admin)",
          request: {
            method: "PATCH",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ name: "Updated Category Name", status: "ACTIVE" }, null, 2)
            },
            url: { raw: "{{base_url}}/categories/1", host: ["{{base_url}}"], path: ["categories", "1"] }
          }
        },
        {
          name: "Delete Category (Super Admin)",
          request: {
            method: "DELETE",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/categories/1", host: ["{{base_url}}"], path: ["categories", "1"] }
          }
        }
      ]
    },
    {
      name: "4. Content",
      item: [
        {
          name: "Upsert Terms & Conditions (Admin)",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ content: "Terms and conditions content...", type: "USER" }, null, 2)
            },
            url: { raw: "{{base_url}}/contents/terms-and-condition", host: ["{{base_url}}"], path: ["contents", "terms-and-condition"] }
          }
        },
        {
          name: "Get Terms & Conditions",
          request: {
            method: "GET",
            url: { raw: "{{base_url}}/contents/terms-and-condition?type=USER", host: ["{{base_url}}"], path: ["contents", "terms-and-condition"], query: [{ key: "type", value: "USER" }] }
          }
        },
        {
          name: "Upsert Privacy Policy (Admin)",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ content: "Privacy policy content...", type: "USER" }, null, 2)
            },
            url: { raw: "{{base_url}}/contents/privacy-policy", host: ["{{base_url}}"], path: ["contents", "privacy-policy"] }
          }
        },
        {
          name: "Get Privacy Policy",
          request: {
            method: "GET",
            url: { raw: "{{base_url}}/contents/privacy-policy?type=USER", host: ["{{base_url}}"], path: ["contents", "privacy-policy"], query: [{ key: "type", value: "USER" }] }
          }
        }
      ]
    },
    {
      name: "5. Settings",
      item: [
        {
          name: "Get Session Settings",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/settings/session-settings", host: ["{{base_url}}"], path: ["settings", "session-settings"] }
          }
        },
        {
          name: "Update Session Settings (Admin)",
          request: {
            method: "PATCH",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ minimumCallMinutes: 5, psychologistPercentage: 80, adminPercentage: 20, payoutReleaseDay: 15 }, null, 2)
            },
            url: { raw: "{{base_url}}/settings/session-settings", host: ["{{base_url}}"], path: ["settings", "session-settings"] }
          }
        },
        {
          name: "Get Payout Release Day",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/settings/payout-release-day", host: ["{{base_url}}"], path: ["settings", "payout-release-day"] }
          }
        }
      ]
    },
    {
      name: "6. Story",
      item: [
        {
          name: "Post Story",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ images: ["https://example.com/story.jpg"], privacy: "PUBLIC" }, null, 2)
            },
            url: { raw: "{{base_url}}/stories", host: ["{{base_url}}"], path: ["stories"] }
          }
        },
        {
          name: "Get Stories By User",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/stories/user/1", host: ["{{base_url}}"], path: ["stories", "user", "1"] }
          }
        },
        {
          name: "Get Single Story",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/stories/1", host: ["{{base_url}}"], path: ["stories", "1"] }
          }
        },
        {
          name: "Toggle React On Story",
          request: {
            method: "POST",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/stories/1/react", host: ["{{base_url}}"], path: ["stories", "1", "react"] }
          }
        },
        {
          name: "Delete Story",
          request: {
            method: "DELETE",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/stories/1", host: ["{{base_url}}"], path: ["stories", "1"] }
          }
        }
      ]
    },
    {
      name: "7. Block User",
      item: [
        {
          name: "Block User",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ blockedId: 5, reason: "Inappropriate behavior" }, null, 2)
            },
            url: { raw: "{{base_url}}/block-users/block", host: ["{{base_url}}"], path: ["block-users", "block"] }
          }
        },
        {
          name: "Unblock User",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ blockedId: 5 }, null, 2)
            },
            url: { raw: "{{base_url}}/block-users/unblock", host: ["{{base_url}}"], path: ["block-users", "unblock"] }
          }
        },
        {
          name: "Get My Blocked Users",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/block-users/my-blocked", host: ["{{base_url}}"], path: ["block-users", "my-blocked"] }
          }
        }
      ]
    },
    {
      name: "8. Follow",
      item: [
        {
          name: "Follow User",
          request: {
            method: "POST",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/follows/follow/2", host: ["{{base_url}}"], path: ["follows", "follow", "2"] }
          }
        },
        {
          name: "Unfollow User",
          request: {
            method: "POST",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/follows/unfollow/2", host: ["{{base_url}}"], path: ["follows", "unfollow", "2"] }
          }
        },
        {
          name: "Get Followers",
          request: {
            method: "GET",
            url: { raw: "{{base_url}}/follows/followers/2", host: ["{{base_url}}"], path: ["follows", "followers", "2"] }
          }
        },
        {
          name: "Get Following",
          request: {
            method: "GET",
            url: { raw: "{{base_url}}/follows/following/2", host: ["{{base_url}}"], path: ["follows", "following", "2"] }
          }
        }
      ]
    },
    {
      name: "9. Notification",
      item: [
        {
          name: "Get My Notifications",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/notifications", host: ["{{base_url}}"], path: ["notifications"] }
          }
        },
        {
          name: "Mark All Notifications Read",
          request: {
            method: "PATCH",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/notifications/read-all", host: ["{{base_url}}"], path: ["notifications", "read-all"] }
          }
        },
        {
          name: "Mark Notification Read",
          request: {
            method: "PATCH",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/notifications/1/read", host: ["{{base_url}}"], path: ["notifications", "1", "read"] }
          }
        },
        {
          name: "Delete Notification",
          request: {
            method: "DELETE",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/notifications/1", host: ["{{base_url}}"], path: ["notifications", "1"] }
          }
        }
      ]
    },
    {
      name: "10. Referral",
      item: [
        {
          name: "Get My Referral Code",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/referrals/my-code", host: ["{{base_url}}"], path: ["referrals", "my-code"] }
          }
        },
        {
          name: "Claim Referral Code",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ referralCode: "FRIEND123" }, null, 2)
            },
            url: { raw: "{{base_url}}/referrals/claim", host: ["{{base_url}}"], path: ["referrals", "claim"] }
          }
        }
      ]
    },
    {
      name: "11. Wallet",
      item: [
        {
          name: "Get My Wallet",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/wallets/my-wallet", host: ["{{base_url}}"], path: ["wallets", "my-wallet"] }
          }
        },
        {
          name: "Get Wallet Transactions",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/wallets/transactions", host: ["{{base_url}}"], path: ["wallets", "transactions"] }
          }
        },
        {
          name: "Manual Transaction (Admin)",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ userId: 5, amount: 50.0, type: "TOPUP", description: "Admin bonus topup" }, null, 2)
            },
            url: { raw: "{{base_url}}/wallets/admin/manual-transaction", host: ["{{base_url}}"], path: ["wallets", "admin", "manual-transaction"] }
          }
        }
      ]
    },
    {
      name: "12. Payment",
      item: [
        {
          name: "Create TopUp Intent",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ amount: 20, currency: "EUR" }, null, 2)
            },
            url: { raw: "{{base_url}}/payments/topup/create-intent", host: ["{{base_url}}"], path: ["payments", "topup", "create-intent"] }
          }
        },
        {
          name: "Confirm TopUp",
          request: {
            method: "POST",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/payments/topup/confirm/1", host: ["{{base_url}}"], path: ["payments", "topup", "confirm", "1"] }
          }
        },
        {
          name: "Request Payout",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ requestedAmount: 100, paymentMethodId: 2 }, null, 2)
            },
            url: { raw: "{{base_url}}/payments/payout/request", host: ["{{base_url}}"], path: ["payments", "payout", "request"] }
          }
        },
        {
          name: "Get My Payout Requests",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/payments/payout/my-requests", host: ["{{base_url}}"], path: ["payments", "payout", "my-requests"] }
          }
        },
        {
          name: "Create Payment Method",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ type: "STRIPE_CARD", cardLast4: "4242", cardBrand: "Visa" }, null, 2)
            },
            url: { raw: "{{base_url}}/payments/methods", host: ["{{base_url}}"], path: ["payments", "methods"] }
          }
        },
        {
          name: "Get My Payment Methods",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/payments/methods", host: ["{{base_url}}"], path: ["payments", "methods"] }
          }
        }
      ]
    },
    {
      name: "13. Product",
      item: [
        {
          name: "Get All Products",
          request: {
            method: "GET",
            url: { raw: "{{base_url}}/products?categoryId=1&isFeatured=true", host: ["{{base_url}}"], path: ["products"], query: [{ key: "categoryId", value: "1" }, { key: "isFeatured", value: "true" }] }
          }
        },
        {
          name: "Get Single Product",
          request: {
            method: "GET",
            url: { raw: "{{base_url}}/products/1", host: ["{{base_url}}"], path: ["products", "1"] }
          }
        },
        {
          name: "Create Product (Admin)",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ name: "Stress Relief Ball", description: "Premium therapy ball", regularPrice: 12.99, discountPercentage: 10, categoryId: 1, isFeatured: true, status: "ACTIVE" }, null, 2)
            },
            url: { raw: "{{base_url}}/products", host: ["{{base_url}}"], path: ["products"] }
          }
        },
        {
          name: "Update Product (Admin)",
          request: {
            method: "PATCH",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ regularPrice: 14.99, isFeatured: false }, null, 2)
            },
            url: { raw: "{{base_url}}/products/1", host: ["{{base_url}}"], path: ["products", "1"] }
          }
        },
        {
          name: "Delete Product (Super Admin)",
          request: {
            method: "DELETE",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/products/1", host: ["{{base_url}}"], path: ["products", "1"] }
          }
        }
      ]
    },
    {
      name: "14. Cart",
      item: [
        {
          name: "Get My Cart",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/cart", host: ["{{base_url}}"], path: ["cart"] }
          }
        },
        {
          name: "Add To Cart",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ productId: 1, quantity: 2, selectedSize: "M" }, null, 2)
            },
            url: { raw: "{{base_url}}/cart/add", host: ["{{base_url}}"], path: ["cart", "add"] }
          }
        },
        {
          name: "Update Cart Item Quantity",
          request: {
            method: "PATCH",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ quantity: 3 }, null, 2)
            },
            url: { raw: "{{base_url}}/cart/item/1", host: ["{{base_url}}"], path: ["cart", "item", "1"] }
          }
        },
        {
          name: "Remove Cart Item",
          request: {
            method: "DELETE",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/cart/item/1", host: ["{{base_url}}"], path: ["cart", "item", "1"] }
          }
        },
        {
          name: "Clear Cart",
          request: {
            method: "DELETE",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/cart/clear", host: ["{{base_url}}"], path: ["cart", "clear"] }
          }
        }
      ]
    },
    {
      name: "15. Shipping Address",
      item: [
        {
          name: "Get My Shipping Addresses",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/shipping-addresses", host: ["{{base_url}}"], path: ["shipping-addresses"] }
          }
        },
        {
          name: "Create Shipping Address",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ fullName: "John Doe", streetAddress: "Road 10, House 45", city: "Dhaka", country: "Bangladesh", zipCode: "1207", phoneNumber: "+8801700000000", isDefault: true }, null, 2)
            },
            url: { raw: "{{base_url}}/shipping-addresses", host: ["{{base_url}}"], path: ["shipping-addresses"] }
          }
        },
        {
          name: "Update Shipping Address",
          request: {
            method: "PATCH",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ streetAddress: "New Road Address 12", city: "Dhaka" }, null, 2)
            },
            url: { raw: "{{base_url}}/shipping-addresses/1", host: ["{{base_url}}"], path: ["shipping-addresses", "1"] }
          }
        },
        {
          name: "Delete Shipping Address",
          request: {
            method: "DELETE",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/shipping-addresses/1", host: ["{{base_url}}"], path: ["shipping-addresses", "1"] }
          }
        }
      ]
    },
    {
      name: "16. Order",
      item: [
        {
          name: "Create Order (Checkout)",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ shippingAddressId: 1, paymentMethod: "WALLET" }, null, 2)
            },
            url: { raw: "{{base_url}}/orders/create", host: ["{{base_url}}"], path: ["orders", "create"] }
          }
        },
        {
          name: "Get My Orders",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/orders/my-orders", host: ["{{base_url}}"], path: ["orders", "my-orders"] }
          }
        },
        {
          name: "Get Order By ID",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/orders/1", host: ["{{base_url}}"], path: ["orders", "1"] }
          }
        },
        {
          name: "Update Order Status (Admin)",
          request: {
            method: "PATCH",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ status: "SHIPPED" }, null, 2)
            },
            url: { raw: "{{base_url}}/orders/1/status", host: ["{{base_url}}"], path: ["orders", "1", "status"] }
          }
        }
      ]
    },
    {
      name: "17. Call",
      item: [
        {
          name: "Initiate Call",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ receiverId: 2 }, null, 2)
            },
            url: { raw: "{{base_url}}/calls/initiate", host: ["{{base_url}}"], path: ["calls", "initiate"] }
          }
        },
        {
          name: "Accept Call",
          request: {
            method: "PATCH",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/calls/accept/1", host: ["{{base_url}}"], path: ["calls", "accept", "1"] }
          }
        },
        {
          name: "End Call (Calculate Billing)",
          request: {
            method: "PATCH",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ duration: 120 }, null, 2)
            },
            url: { raw: "{{base_url}}/calls/end/1", host: ["{{base_url}}"], path: ["calls", "end", "1"] }
          }
        },
        {
          name: "Get Call History",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/calls/history", host: ["{{base_url}}"], path: ["calls", "history"] }
          }
        }
      ]
    },
    {
      name: "18. Session Review",
      item: [
        {
          name: "Create Review",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ psychicId: 2, rating: 5, comment: "Extremely helpful session!" }, null, 2)
            },
            url: { raw: "{{base_url}}/session-reviews", host: ["{{base_url}}"], path: ["session-reviews"] }
          }
        },
        {
          name: "Get Psychic Reviews",
          request: {
            method: "GET",
            url: { raw: "{{base_url}}/session-reviews/psychic/2", host: ["{{base_url}}"], path: ["session-reviews", "psychic", "2"] }
          }
        }
      ]
    },
    {
      name: "19. Admin",
      item: [
        {
          name: "Dashboard Overview",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/admin/dashboard/overview", host: ["{{base_url}}"], path: ["admin", "dashboard", "overview"] }
          }
        },
        {
          name: "Get All Users (Admin View)",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/admin/users", host: ["{{base_url}}"], path: ["admin", "users"] }
          }
        },
        {
          name: "Get Psychologist Applications",
          request: {
            method: "GET",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/admin/psychologists", host: ["{{base_url}}"], path: ["admin", "psychologists"] }
          }
        },
        {
          name: "Approve Psychologist Application",
          request: {
            method: "POST",
            header: [{ key: "Authorization", value: "Bearer {{token}}" }],
            url: { raw: "{{base_url}}/admin/psychologists/2/approve", host: ["{{base_url}}"], path: ["admin", "psychologists", "2", "approve"] }
          }
        },
        {
          name: "Reject Psychologist Application",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ rejectionReason: "Invalid certificate provided" }, null, 2)
            },
            url: { raw: "{{base_url}}/admin/psychologists/2/reject", host: ["{{base_url}}"], path: ["admin", "psychologists", "2", "reject"] }
          }
        },
        {
          name: "Update User Status (Block/Activate)",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "Authorization", value: "Bearer {{token}}" }
            ],
            body: {
              mode: "raw",
              raw: JSON.stringify({ status: "BLOCKED" }, null, 2)
            },
            url: { raw: "{{base_url}}/admin/users/5/status", host: ["{{base_url}}"], path: ["admin", "users", "5", "status"] }
          }
        }
      ]
    }
  ]
};

const collectionPath = path.join(__dirname, 'postman_collection.json');
const rootCollectionPath = path.join(__dirname, '..', 'postman_collection.json');

fs.writeFileSync(collectionPath, JSON.stringify(collection, null, 2), 'utf-8');
fs.writeFileSync(rootCollectionPath, JSON.stringify(collection, null, 2), 'utf-8');

console.log(`[Postman Collection Generator] SUCCESS!`);
console.log(`Generated official Postman v2.1.0 Collection at:`);
console.log(`1. ${collectionPath}`);
console.log(`2. ${rootCollectionPath}`);
