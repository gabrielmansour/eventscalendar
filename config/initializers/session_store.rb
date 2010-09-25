# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_eventcalendar_session',
  :secret      => '134cfde045acee2403303c3e58da63d81a13e4d96799b9768b12d589a938ef608d63e5b4ab4273aa38ec6b8b9ead0b9055f219cd8ddc621f4eb73aa473fa1bd3'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
