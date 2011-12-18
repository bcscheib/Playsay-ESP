class AddUserQueue < ActiveRecord::Migration
  def self.up
    create_table :users do |t|
      t.string :facebook_id
      t.boolean :queued, :default => true
      t.float :points, :default => 0
      t.integer :paired_user_id
      t.boolean :logged_in, :default => true
      t.timestamps
    end
  end

  def self.down
    drop_table :users
  end
end
