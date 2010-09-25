class CreateVenues < ActiveRecord::Migration
  def self.up
    create_table :venues, :force => true do |t|
      t.column :name, :string
      t.column :address, :string
      t.column :city, :string
      t.column :province, :string
      t.column :postal_code, :string
      t.column :country, :string
      t.column :phone_number, :string
      t.column :url, :string
      t.column :description, :text
      t.column :time_zone, :string
      t.column :latitude, :decimal
      t.column :longitude, :decimal
      t.column :user_id, :integer
    end
    
    add_column :events, :venue_id, :integer
  end

  def self.down
    remove_column :events, :venue_id
    drop_table :venues
  end
end
