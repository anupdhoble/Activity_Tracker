# app/models/banned_website.rb
class BannedWebsite < ApplicationRecord
  belongs_to :user

  validates :url, presence: true, uniqueness: { scope: :user_id }
end
