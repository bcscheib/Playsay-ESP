class CreateGuesses < ActiveRecord::Migration
  def self.up
    create_table :guesses do |t|
      t.string :photo_src
      t.string :body
      t.integer :user_id
      t.boolean :matched, :default => false
      t.timestamps
    end
  end

  def self.down
    drop_table :guesses
  end
end
