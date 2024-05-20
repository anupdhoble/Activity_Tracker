# app/models/user.rb
class User < ApplicationRecord
  has_secure_password
  validates :email, presence: true, uniqueness: true
  has_many :activities
  has_many :banned_websites
end
