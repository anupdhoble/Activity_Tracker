class AddAttributesToActivities < ActiveRecord::Migration[7.1]
  def change

    add_column :activities, :type, :string
    add_column :activities, :start_time, :datetime
    add_column :activities, :time_elapsed, :string
  end
end
