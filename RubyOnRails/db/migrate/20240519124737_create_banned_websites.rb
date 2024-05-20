class CreateBannedWebsites < ActiveRecord::Migration[7.1]
  def change
    create_table :banned_websites do |t|
      t.string :url

      t.timestamps
    end
  end
end
