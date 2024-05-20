class AddUserIdToBannedWebsites < ActiveRecord::Migration[7.1]
  def change
    add_reference :banned_websites, :user, null: false, foreign_key: true
  end
end
